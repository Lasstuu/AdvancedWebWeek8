import mongoose, {Document, Schema} from "mongoose"

interface ITopic extends Document{
    title: string,
    content: string,
    username: string,
    createdAt: Date
}



let topicSchema: Schema = new Schema({
    title: {type: String},
    content: {type: String},
    username: {type: String},
    createdAt: {type: Date}
})

const Topic: mongoose.Model<ITopic> = mongoose.model<ITopic> ("Topic", topicSchema)
export {Topic, ITopic}