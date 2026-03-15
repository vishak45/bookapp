const bycrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userModel=require('../model/userModel');

const registerUser=async(req,res)=>{
    try{
        const{name,email,password}=req.body;

        let userExist=await userModel.findOne({email});
        if(userExist)
        {
            return res.status(400).json({
                message:"Email already taken"
            })
        }
        const passHash=await bycrypt.hash(password,10);
        const user=await userModel.create({
            name,
            email,
            password:passHash
        });

        return res.status(201).json({
            message:"User created successfully",
            user
        })

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        let userExist=await userModel.findOne({email});
        if(!userExist)
        {
            return res.status(400).json({
                message:"User does not exist"
            })
        }
        let passMatch=await bycrypt.compare(password,userExist.password);
        if(!passMatch)
        {
            return res.status(400).json({
                message:"Password does not match"
            })
        }

        const token=jwt.sign({id:userExist._id},process.env.JWT_SECRET);
        return res.status(200).json({
            message:"Login successful",
            userExist,token
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
const updatePassword=async(req,res)=>{
    const userid=req.user.id;
    const{oldpass,newpass}=req.body;
    try{
        const userExist=await userModel.findById(userid);
        if(!userExist)
        {
            return res.status(400).json({
                message:"User does not exist"
            })
        }
        const passMatch=await bycrypt.compare(oldpass,userExist.password);
        if(!passMatch)
        {
            return res.status(400).json({
                message:"Password does not match"
            })
        }
        const passHash=await bycrypt.hash(newpass,10);
        userExist.password=passHash;
        await userExist.save();
        return res.status(200).json({
            message:"Password updated successfully"
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
module.exports={
    registerUser,
    loginUser,
    updatePassword
}