import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'influencer', 'business'],
        default: 'influencer'
    },
}
,
{
    timestamps:true
});


export default mongoose.model("User", User);
