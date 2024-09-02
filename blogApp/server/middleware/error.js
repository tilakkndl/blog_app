const AppError = require("../utils/appError");
module.exports = (err, req, res, next)=>{
    console.log("Global error handler is handling")
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    err.message = err.message || "Something went wrong";


    //Invalid mongoose id
    if(err.name==="CastError"){
        const message = "The id you are providing is invalid"
        err = new AppError(message, 400);
    }

    //Mongoose dublicate key error
    if(err.code === 11000){
        console.log("The error starts here");
        console.log((err))
        const message = `The dublicate key ${Object.keys(err.keyValue)} entered`;
        err = new AppError(message, 400);
    }

    //mongoose validation error
    if(err.name==="ValidationError"){
        let message = (Object.values(err.errors).map(value=>value.message))
        err = new AppError(message, 400);
    }

    //wrong jwt token
    if(err.nam === "JsonWebTokenError"){
        const message = 'The jwt is invalid. try again';
        err = new AppError(message, 400);
    }


    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack
    })
}