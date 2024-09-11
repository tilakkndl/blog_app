const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const sendEmail = require("../utils/sendEmail")
const createToken = (id) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
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




exports.signup = catchAsync(async (req, res, next)=>{
    const {name, email, password, confirmPassword} = req.body;
    const user = await User.findOne({email});
    if(user){
        return next(new AppError("User already exists", 400));
    }
    let newUser = await User.create({
        name,
        email,
        password,    
        confirmPassword,
    });
     //convert mongoose object into js object;
     newUser = newUser.toObject()
     //delete passwor field
     delete newUser.password;

    sendTokenWithData(newUser, 201,res);

})

exports.login = catchAsync(async (req, res, next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new AppError("Please provide email and password", 400));
    }
    let user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new AppError("Invalid email or password", 401));
    }

    let correctPassword = await user.checkPassword(password);
    if(!correctPassword){
        return next(new AppError("Invalid email or password", 401));
    }

    //convert mongoose object into js object;
    user = user.toObject()
    //delete passwor field
    delete user.password;

    sendTokenWithData(user, 200, res);
    req.body = user;

})

exports.logout = catchAsync(async(req, res, next)=>{
    res.cookie("jwt", null, {
        expiresIn: new Date(Date.now())
    })

    res.status(200).json({
        success: true,
        message: "Successfully log out"
    })
})

exports.forgetPassword = catchAsync(async(req, res, next)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return next(new AppError("User not found with this mail", 404));
    }

    console.log(user);
    const resetToken = user.getResetToken();
    await user.save({validateBeforeSave: false})
    const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = ` Your reset token is as follow:\n ${resetUrl}. \nIf you did not request this, please ignore this email.`

    try{
        await sendEmail({
            email: user.email,
            subject: "Reset Password Token",
            message
        })
        res.status(200).json({
            success: true,
            message: `Token sent to your mail ${user.email}`
        })

    }catch(err){

        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save({validateBeforeSave: false})
        return next(new AppError("Error in sending mail", 500));

    }
})

exports.resetPassword = catchAsync(async(req, res, next)=>{
    const resetToken = req.params.resetToken;
    console.log(resetToken);
    const {password, confirmPassword} = req.body;
    const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({
        resetPasswordToken: hashToken,
        resetPasswordTokenExpires: {$gt: Date.now()}
    });

    console.log(user)

    if(!user){
        return next(new AppError("Token is invalid or expired", 400));
    }

    if(password !== confirmPassword){
        return next(new AppError("Password and confirmPassword do not match", 400));
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();
    sendTokenWithData(user, 200, res);
    
})





exports.updatePassword = catchAsync(async(req, res, next)=>{
    const {currentPassword, newPassword, confirmPassword} = req.body;
    
    const user = await User.findById(res.body._id).select("+password");
    if(!user){
        return next(new AppError("User not found", 404));
    }
    const checkPassword = await user.checkPassword(currentPassword);
    if(!checkPassword){
        return next(new AppError("Password is incorrect", 400));
    }
    if(newPassword !== confirmPassword){
        return next(new AppError("Password and confirmPassword do not match", 400));
    }

    user.password = newPassword;
    user.confirmPassword = undefined;
    await user.save({validateBeforeSave: false});
    sendTokenWithData(user, 200, res);
})