const express = require("express");

const {signup, login} = require("../controller/userController")

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - confirmPassword
 *      properties:
 *        _id:
 *          type: string
 *          description: The Auto-generated id of user collection
 *          example : DHSASDHJDJHVAJDSVJAVSD
 *        name:
 *          type: string
 *          description: User name
 *        email:
 *          type: string
 *          description: user email address
 *        password:
 *          type: string
 *          description: user password should be greater then 8 character
 *        confirmPassword:
 *          type: string
 *          description: user password should be greater then 8 character
 *      example:
 *        _id: GDHJGD788BJBJ
 *        name: tilak
 *        email: tilak@gmail.com
 *        password: test@123
 *        confirmPassword: test@123
 *        role: "user"
 *     
 */

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;