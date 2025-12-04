const express=require('express');
const app=express()
const port=3000;
const dotenv=require('dotenv');
app.use(express.json());
dotenv.config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());


const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
const connectDB=require('./src/config/dbconfig');
bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const adminRoutes=require('./src/routes/adminRoutes');
const authRoutes=require('./src/routes/authRouter');
const commonRoutes=require('./src/routes/commonRoutes');
app.use('/admin',adminRoutes);
app.use('/auth',authRoutes);
app.use('/',commonRoutes);



connectDB().then(()=>{
    console.log("mongoose connected");
    app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});
}).catch((error)=>{
    console.log("mongoose not connected",error)
});


