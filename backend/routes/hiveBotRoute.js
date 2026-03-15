const express=require('express');
const protect=require('../middleware/authMiddleWare');
const router=express.Router();
const {askQuestion,historyFetch}=require('../controller/hiveController');
router.post('/askquestion',protect,askQuestion);
router.get('/checkhistory',protect,historyFetch);
module.exports=router;