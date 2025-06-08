const validator = require("validator");

const validateSignUpData = (data) =>{
    const {email , password , username} = data;
    if(!validator.isLength(username , {min : 3 , max : 15})) throw new Error("Name length should be between 3 and 15");
    else if(!validator.isEmail(email)) throw new Error("Invalid email");
    else if(!validator.isStrongPassword(password)) throw  new Error("Invalid password");
}

module.exports = {validateSignUpData}