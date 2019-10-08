const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require("config");
const userSchema = new mongoose.Schema({
  first_name:{
    type:'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  last_name:{
    type: 'string',
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 30
  },
  email:{
    type :'string',
    required: true,
    minlength: 8,
    maxlength: 50,
    unique: true,
    lowercase: true,
    validate: value => {
        if (!validator.isEmail(value)) {
            throw new Error({error: 'Invalid Email address'})
        }
    }
  },
  password:{
    type :'string',
    required: true,
    minlength: 7,
    maxlength: 100
  },
  tokens: [{
      token: {
          type: String,
          required: true
      }
  }],
  userrole_id: { type: mongoose.Schema.ObjectId, ref: 'userrole', required: true },
  
});
userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
  }
  next()
})

userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  // var d = new Date();
  // var calculatedExpiresIn = (((d.getTime()) + (60 * 60 * 1000)) - (d.getTime() - d.getMilliseconds()) / 1000);


  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"),{expiresIn: '8h'});
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({email});
  if (!user) {
      throw new Error({ error: 'Invalid login credentials' });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
      throw new Error({ error: 'Invalid login credentials' });
  }
  return user;
}

const collectionName = 'user';
const User = mongoose.model("user", userSchema, collectionName);

exports.userSchema = userSchema;
exports.User = User;
