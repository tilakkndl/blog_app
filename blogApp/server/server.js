const dotenv = require("dotenv");
const mongoose = require("mongoose")
dotenv.config({path: "./.config.env"})

const app = require("./app")

const PORT=process.env.PORT || 5000


mongoose.connect(process.env.DB_URL.replace("<db_password>", process.env.DB_PASSWORD), {})
.then(()=>{
    console.log("Connected to database")
})
.catch((err)=>{
console.log(err);
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
