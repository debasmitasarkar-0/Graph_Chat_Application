const mongoose = require('mongoose');

//This is the location of the database.
// const mongoURI = "mongodb://localhost:27017/ChatApp?directConnection=true&tls=false&readPreference=primary";
const mongoURI = "mongodb+srv://animeshdhara398:nYKENUXXFRMWk4tO@cluster0.h2vfhzm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI);
    console.log("Connect to mongo db successfully.");
}

module.exports=connectToMongo;