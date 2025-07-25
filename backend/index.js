const express=require('express');
const dotenv=require('dotenv');
const connectDB=require('./config/db');
const cors=require('cors');
const parser=require('body-parser');
const port=3000
const userRoutes=require('./routes/userRoutes');
const bookRoutes=require('./routes/bookRoutes');
const hivebotRoutes=require('./routes/hiveBotRoute');
const {storeBooks}=require('./controller/bookController');
dotenv.config();
const app=express();
connectDB();

app.use(cors());
app.use(parser.json());
app.use('/api/user',userRoutes);
app.use('/api/book',bookRoutes);
app.use('/api/hivebot',hivebotRoutes);
storeBooks();
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})