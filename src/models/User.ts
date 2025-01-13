import mongoose, {Document, Schema} from "mongoose"

interface IUser extends Document{
    email: string,
    password: string,
    username: string,
    isAdmin: boolean
}



let userSchema: Schema = new Schema({
    email: {type: String},
    password: {type: String},
    username: {type: String},
    isAdmin: {type: Boolean}
})

const User: mongoose.Model<IUser> = mongoose.model<IUser> ("User", userSchema)
export {User, IUser}