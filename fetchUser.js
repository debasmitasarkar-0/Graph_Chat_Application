const jwt = require('jsonwebtoken');
const jwtSecret = "AnimeshJwt@Secret";
const User = require('../models/User');
// const jwtSecret = process.env.REACT_APP_JWT_SECRET;

//Creating the middleware function.
const fetchuser =async(token)=>{
    console.log("Called  Middleware");
    if(!token){
       return JSON.stringify("Please authenticate using a valid token");
    }
    
    try {
        const data =jwt.verify(token,jwtSecret);
        const userId = data.user;
        const user =await User.findById(userId);
        return user;
    } catch (error) {
        return JSON.stringify("Please authenticate using a valid token");
    }

}

module.exports = fetchuser;