const mongoose = require('mongoose');

   const emailSchema = new mongoose.Schema({
     from: String,
     to: String,
     subject: String,
     html: String,
     text: String,
     userId: String,
     type: String, // e.g., 'welcome', 'newsletter', 'transactional', 'engagement', 'composed'
     sentAt: { type: Date, default: Date.now },
   });

   module.exports = mongoose.model('Email', emailSchema);