const catchAsync = require('./catchAsync');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const cloudinaryUpload = catchAsync(async(req, res, next)=>{
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog_app'
    });
    req.body.image = result.secure_url;
    next();
})

module.exports = cloudinaryUpload;