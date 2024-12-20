const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    chat_ids:[],
    group_chat_ids:[],
    date:{
        type:Date,
        default:Date.now
    }
  });

  const user = mongoose.model("User",userSchema);
  
  module.exports = user;