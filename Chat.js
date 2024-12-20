const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    messages:[],
    date:{
        type:Date,
        default:Date.now
    }
  });

  const chat = mongoose.model("Chat",userSchema);
  
  module.exports = chat;