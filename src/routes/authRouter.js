const express = require('express');
const router = express.Router();
const { validateSignup } = require('../utils/validatefn');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { userAuth } = require('../middleware/varifyAuth');


router.post('/signup', async (req, res) => {
    try{
        const isValid= validateSignup(req.body);
        if(!isValid){
            return res.status(400).send({message:"Invalid signup data"});
        }
        const { name,email, password,} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        const savedUser=await newUser.save();
        const token= await savedUser.getjwtToken();
        res.cookie('token',token,{
            expires: new Date(Date.now()+7*24*60*60*1000),
            httpOnly:true,
        });
        res.status(201).send({message:"User registered successfully", user: newUser});
    }catch(err){
         if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(400).json({
                success: false,
                message: "Email already exists. Please use a different email address.",
            });
        }
        res.status(500).send({message: err.message});
    }       

});

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user=await User.findOne({ email });
        if(!user){
            return res.status(400).send({message:"Invalid email or password"});
        }
        const isMatch=await user.passwordCheck(password);
        if(!isMatch){
            return res.status(400).send({message:"Invalid email or password"});
        }   
        const token=await user.getjwtToken();
       
        res.cookie('token',token,{
            expires: new Date(Date.now()+7*24*60*60*1000),
            httpOnly:true,
        });
        res.status(200).send({message:"Login successful", user});
    }catch(err){
        res.status(500).send({message: err.message});
    }
});


router.post('/logout', userAuth, async (req, res) => {
    try{
        res.clearCookie('token');
        res.status(200).send({message:"Logout successful"});
    }catch(err){
        res.status(500).send({message: err.message});
    }   
});





module.exports = router;