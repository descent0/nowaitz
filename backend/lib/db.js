const { default: mongoose } = require("mongoose")
const dotenv= require('dotenv');
dotenv.config();
const connectDB= async ()=>{
    try{
         const conn=await mongoose.connect(process.env.MONGODB_URI);
         console.log(`mongo db connected:${conn.connection.host}`)
    }catch(error){
console.log(`error connecting the db ${error}`)
    }
}
module.exports={
    connectDB,
}