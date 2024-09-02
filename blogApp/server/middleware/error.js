module.exports = (err, req, res, next)=>{
    console.log("Global error handler is handling")
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    err.message = err.message || "Something went wrong";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack
    })
}