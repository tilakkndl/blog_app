const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Post = require("../model/postModel");
const ApiFeature = require("../utils/apiFeature");

 exports.createPost = catchAsync(async(req, res, next)=>{
    const {title,content, category, keywords } = req.body;

    console.log(req.body)
    const newPost = await Post.create({
        title,
        content,
        category,
        keywords,
        author: res.body._id
        
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