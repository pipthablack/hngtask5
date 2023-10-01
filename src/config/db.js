const mongoose = require('mongoose');
require("dotenv").config();


const connectDB = async () => {
    try{
        const conn = await mongoose.connect("mongodb+srv://fileupload:chinonso@cluster0.hpbvzul.mongodb.net", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
           
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(err)
    {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;