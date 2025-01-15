
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        document.getElementById("topicForm").style.display = "block";
        loadTopics();
        }
    });

document.getElementById("postTopic").addEventListener("click", async (event) => {
    event.preventDefault();
    const title = document.getElementById("topicTitle").value;
    const content = document.getElementById("topicText").value;
    const token = localStorage.getItem("token");

    const response = await fetch("/api/topic", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
    });

    if (response.ok) {
        loadTopics();
    }
});

async function loadTopics() {
    const response = await fetch("/api/topics", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (response.ok) {
        const topics = await response.json()
        const topicsDiv = document.getElementById("topics")
        topicsDiv.innerHTML = ""
        topics.forEach(topic => {
            const topicDiv = document.createElement("div")
            topicDiv.innerHTML = `
                <span>${topic.title}</span>
                <p>${topic.content}</p>
                <p>Posted by ${topic.username} on ${topic.createdAt}</p>
                <button class="btn deleteTopic" data-id="${topic._id}">Delete</button>
            `
            topicsDiv.appendChild(topicDiv)
        })

        document.querySelectorAll(".deleteTopic").forEach(button => {
            button.addEventListener("click", async (event) => {
                const id = event.target.getAttribute("data-id");
                const token = localStorage.getItem("token");

                const response = await fetch(`/api/topic/${id}`, {
                    method: "delete",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    loadTopics()
                } else {
                    const data = await response.json();
                    alert(data.message)
                }
            })
        })
    } 
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm").style.display = "hidden"
    if (localStorage.getItem("token")) {
        document.getElementById("topicForm").style.display = "block"
        loadTopics()
    }
})
