const express = require("express");
const {createPost, getAllPost, getSinglePost, updatePost, deletePost, savePost, getSavePost} = require("../controller/postController")
const isAuthenticated = require("../middleware/isAuthenticated");
const multerUpload = require("../utils/multer");
const cloudinaryUpload = require("../utils/cloudinary");

const router = express.Router()

router.route("/save").post(isAuthenticated, savePost).get(isAuthenticated,getSavePost);
router.route("/").post(isAuthenticated,multerUpload, cloudinaryUpload, createPost).get(getAllPost)
router.route("/:id").get(getSinglePost).put(isAuthenticated, updatePost).delete(isAuthenticated, deletePost);

module.exports = router;