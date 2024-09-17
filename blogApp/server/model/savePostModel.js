const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: "Blog",
        required: true
    
    }
})

const SavePost = mongoose.model("SavePost", postSchema);
module.exports = SavePost;