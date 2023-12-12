const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const userRegistration = async(req,res)=>{
    try {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(req.body.password,salt);
        const newUser = new userModel({
            username : req.body.username,
            email : req.body.email,
            password : password,
            dp : req.body.dp
        });
        await newUser.save();
        res.status(200).json({customResponse:"User has been successfully created!"});
    } catch (error) {
        if (error.code === 11000 ) {
            return res.status(400).json({ customResponse: "User with Email already exists", error: error });
        }
        else{
            res.status(500).json({ customResponse: "Error while saving user!", error:error });
            console.log(error);
        }
    }
}
module.exports = userRegistration;