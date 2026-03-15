const mongoose = require("mongoose");
const BookSchemaList=new mongoose.Schema({
    bookid:{type:mongoose.Schema.Types.ObjectId,ref:'Book',required:true},
    title:{type:String,required:true},
    authors:[String],
   
    
   
    coverImage:{type:String,required:true},
    subject:{type:String,required:true},
    
})
const readListSchema = new mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    bookInfo:[BookSchemaList]// ✅ Short description of the book

})
module.exports = mongoose.model("readlist", readListSchema);
