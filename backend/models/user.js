const mongoose = require('mongoose');

   const userSchema = new mongoose.Schema({
     googleId: String,
     name: String,
     email: String,
     role: { type: String, default: 'user' },
     welcomeEmailSent: { type: Boolean, default: false },
     resetToken: String,
     resetTokenExpires: Date,
   });

   module.exports = mongoose.model('User', userSchema);