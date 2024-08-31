const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "User name should be at least of 3 character"],
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: function (el) {
                return emailValidator.validate(el);
            },
            message: "Email is not valid"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "confirmPassword is required"],
        minlength: 8,
        // select: false,
        validate : {

         validator:  function (el) {
            return el === this.password;
         },
            message: "Passwords do not match"
        }
    },
    role: {
        type: String,
        enum: ["user", "admin", "contributor"],
        default: "user"
    },
    
});

//hash password before saving
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
})

userSchema.methods.checkPassword = async function(givenPassword, hashedPassword){
    return await bcrypt.compare(givenPassword, hashedPassword);

}

const User = mongoose.model("User", userSchema);

module.exports = User;