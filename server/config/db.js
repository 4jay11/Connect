const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect("mongodb+srv://ajayc:ajayc@cluster0.z9jynu3.mongodb.net/",{
            dbName: "social-network-app"
        });
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}
module.exports = connectDB;