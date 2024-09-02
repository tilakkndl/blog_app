const express = require("express");
const {createPost, getAllPost, getSinglePost, updatePost, deletePost} = require("../controller/postController")
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router()

router.route("/").post(isAuthenticated, createPost).get(getAllPost)
router.route("/:id").get(getSinglePost).put(isAuthenticated, updatePost).delete(isAuthenticated, deletePost);


module.exports = router;