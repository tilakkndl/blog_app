const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require("express");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const multer = require("multer");

const errorMiddleware = require("./middleware/error");
const userRouter = require("./route/userRoute")
const postRouter = require("./route/postRoute");
const cloudinary = require("./utils/cloudinary");
const uploadImage = require("./utils/multer");


const app = express();

const options = {
	definition: {
	  openapi: "3.0.0",
	  info: {
		title: "Blog App API",
		description: "A simple Express blogging app API",
		version: "1.0.0",
	  },
	  servers: [
		{
		  url: "http://localhost:4000",
		},
	  ],
	},
	apis: [
	  "./route/*.js",
	],
  };
  

  

const specs = swaggerJsdoc(options);



//middleware
app.use(express.json());
// app.use(morgan("dev"));
app.use(morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms'))
app.use(cookieparser())









app.get("/",  async(req, res, err) => {})




app.use("/api/v1/auth", userRouter);
app.use("/api/v1/post", postRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorMiddleware);

module.exports =app;