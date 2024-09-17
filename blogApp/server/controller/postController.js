const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Post = require("../model/postModel");
const ApiFeature = require("../utils/apiFeature");
const User = require("../model/userModel")

 exports.createPost = catchAsync(async(req, res, next)=>{
    const {title,content, category, keywords, state } = req.body;
    console.log(req.body);
    const newPost = await Post.create({
        title,
        content,
        category,
        keywords,
        // state ? state : "draft",
        state,
        author: res.body._id,
        image: req.body.image
        
    })
    res.status(201).json({
        success: true,
        message: "Successfully created a blog post",
        data: {
            newPost
        }
    })
})

exports.getAllPost = catchAsync(async(req, res, next)=>{
    const blogPerPage=3;
    // const allPosts = await Post.find();
    const apiFeature = new ApiFeature(Post.find(), req.query);
    apiFeature.search().pagination(blogPerPage);
    const posts = await apiFeature.query;
    console.log(posts);
    if(posts.length===0)
       return  next(new AppError("No posts are found", 404));
    res.status(200).json({
        success: true,
        message:"Get posts",
        data: {
            posts,
            noOfPost:posts.length
        }
    })
})

exports.getSinglePost = catchAsync(async(req, res, next)=>{
    const post = await Post.findById(req.params.id);
    if(!post){
        return(next(new AppError("The post with this is not found", 404)));
    }
    res.status(200).json({
        success: true,
        message: "Post found",
        data: {
            post
        }
    })
})

exports.updatePost = catchAsync(async(req, res, next)=>{
    const post = await Post.findById(req.params.id);
    if(!post){
        return next(new AppError(`Post with id ${req.params.id} is not found`, 404))
    }
    if(!post.author.equals(res.body._id)){
        return next(new AppError('you are not author of this post.', 401));
    }
    req.body = {...req.body, createdAt: post.createdAt, updatedAt: new Date(Date.now()), author: res.body._id}
    console.log(req.body)
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true, useFindAndModify: false
    })

    //note 204 doesn't return data

res.status(200).json({
    success: true,
    message: "post updated successfully",
    data: {
        updatedPost
    }
})
})

exports.deletePost = catchAsync(async(req, res, next)=>{

    const post = await Post.findById(req.params.id);
    if(!post){
        return next(new AppError(`Post with id ${req.params.id} is not found`, 404))
    }
    if(!post.author.equals(res.body._id)){
        return next(new AppError('you are not author of this post.', 401));
    }

    const deletePost = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "post deleted successfully",
        data: {
            deletePost
        }
    })
    
})

exports.savePost = catchAsync(async(req, res, next)=>{
    const id = req.body.id;
    const user = await User.findById(res.body._id);
    if(!user){
        return next(new AppError("User not found.Please log in first", 404));
    }
    const updatedUser  = await User.findByIdAndUpdate(res.body._id, {$push: {savePosts: id}}, {new: true, runValidators: true, useFindAndModify: false});

    res.status(200).json({
        success: true,
        message: "Post saved successfully",
        data: {
            updatedUser
        }
    })
})


exports.getSavePost = catchAsync(async(req, res, next)=>{
    const user = res.body._id;
    const userSavePost = await User.findById(user).populate("savePosts");
    res.status(200).json({
        success: true,
        message: "Get saved posts",
        data: {
            userSavePost: userSavePost.savePosts
        }
    })
})