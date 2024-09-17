const catchAsync = require("./catchAsync");
const AppError = require("./appError");
const multer = require("multer");
const fileLimit ={
	fileSize: 1048576 , //in bytes
	filename: 100,
}

const storage = multer.diskStorage({
	// destination: function(req, file, cb){
	// 	cb(null, 'uploads/')
	// },
	filename: function(req, file, cb){
		cb(null, Date.now() + file.originalname)
	}
})


const fileFilter = function(req, file, cb){
	if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/jpg'){
		cb(null, true)
	}else{
		cb(new Error('Please enter jpg, jpeg or png image only'), false)
	}	
}

const multerUpload = catchAsync(async(req, res, next)=>{
    // console.log(req);
    console.log(req.body);
    const upload = multer({
        storage: storage,
        limits: fileLimit,
        fileFilter
    }).single("image")
    upload(req, res, (err)=>{
        if( err instanceof multer.MulterError){
            return next(new AppError(err.message, 400));
          
        } else if(err){
           return next(new AppError(err.message, 400));
        }
        next();
    })
})

module.exports = multerUpload;