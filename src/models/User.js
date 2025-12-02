const moongose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
bcrypt = require('bcrypt');
const userSchema = new moongose.Schema({
    name: {
        type: String,
        required: true
    },
     email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.methods.getjwtToken =async function() {
    const user= this
    const token=await jwt.sign({id:user._id},process.env.SECRET_KEY,{
        expiresIn:'7d',
    });
   
    return token;
}



userSchema.methods.passwordCheck =async function(inputpassword) {
    const userHashedPass=this.password
    const isMatch=await bcrypt.compare(inputpassword, userHashedPass);
    return isMatch;
}
const User = moongose.model('User', userSchema);
module.exports = User;