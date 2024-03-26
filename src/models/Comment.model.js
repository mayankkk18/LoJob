import mongoose, {Schema} from "mongoose";
const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
}, {
    timestamps: true
});

export const Comment = mongoose.model('Comment', commentSchema);