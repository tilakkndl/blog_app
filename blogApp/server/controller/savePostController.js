const SavePost = require('../model/savePostModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Post = require('../model/postModel');


exports.savePost = catchAsync(async (req, res, next) => {
    const user = req.user._id;
    const blog = req.body.blog;
    
})