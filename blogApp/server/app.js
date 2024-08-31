
const express = require("express");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("swagger-jsdoc");

const errorMiddleware = require("./middleware/error");
const userRouter = require("./route/userRoute")

// Swagger api config
// swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Simple blog app",
      description: "Node Expressjs blog Application",
    },
    servers: [
      {
        url: "http://localhost:4000",
          
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);




const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
})

app.use("/api/v1/auth", userRouter);

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

app.use(errorMiddleware);

module.exports =app;