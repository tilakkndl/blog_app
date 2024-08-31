const jwt = require("jsonwebtoken");

const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

const createToken = (id) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    console.log(token);
    return token;
}

const sendTokenWithData = (user, statusCode, res) => {
    const token = createToken(user._id);
    res.cookie("jwt", token, {
        expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // secure: true  // not working on localhost
    })
    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user
        }
    })
}



exports.signup = catchAsync(async (req, res)=>{
    const {name, email, password, confirmPassword} = req.body;
    const newUser = await User.create({
        name,
        email,
        password,    
        confirmPassword
    });
    sendTokenWithData(newUser, 201,res);

})

exports.login = catchAsync(async (req, res, next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new AppError("Please provide email and password", 400));
    }
    const user = await User.findOne({email}).select("+password");

    let correctPassword = await user.checkPassword(password, user.password);
    if(!user || !correctPassword){
        return next(new AppError("Invalid email or password", 401));
    }

    sendTokenWithData(user, 200, res);

})

