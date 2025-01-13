document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = document.getElementById('email').value
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const isAdmin = document.getElementById('isAdmin').checked

    const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password, isAdmin })
    })

    if (response.ok) {
        window.location.href = 'index.html';
    } else {
        alert('Registration failed');
    }
})