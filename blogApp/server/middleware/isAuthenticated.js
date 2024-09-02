// const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const isAuthenticated = catchAsync(async(req, res, next)=>{
    const token = req.cookies.jwt;
    if(!token){
        return next(new AppError("Login in first to access this ", 401));
    }
    const decoded_id = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded_id.id);
    res.body=user;
    
    next();
})

module.exports = isAuthenticated;