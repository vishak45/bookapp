const express=require('express');
const protect=require('../middleware/authMiddleWare');
const router=express.Router();
const {registerUser,loginUser,updatePassword}=require('../controller/userController');
router.post('/register',registerUser);
router.post('/login',loginUser);
router.put('/updatepassword',protect,updatePassword);
module.exports=router;