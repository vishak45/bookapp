const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.DB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("✅ MongoDB connected");
    }
    catch(error)
    {
        console.log("error is",error);
        process.exit(1);
    }
}

module.exports=connectDB;