const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title of blog app is mandatory"],
        trim: true
    },
    content: {
        type: String,
        required: [true, "Content for the blog is required"],
     
   
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true

    },
    category: {
        type: String,
        required: true,
        enums: ["web", "android", "ios", "desktop"]
    },
    keywords: {
        type: [String],
        // required: true,
    },
    image: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: "draft",
        enums: ["draft", "published", "deleted"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;