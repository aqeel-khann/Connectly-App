const mongoose = require("mongoose")

const connectDB = async () => {
        try {
            await mongoose.connect("mongodb://127.0.0.1:27017/PostApp")
            console.log("Database Connected")
        } catch (error) {
             console.log("Error in Connection", error)
        }
    }

    module.exports=connectDB