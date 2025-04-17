const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  emailId: { type: String, required: true },
  userId: { type: String, required: true },
  type: { type: String, required: true }, // 'delivered', 'open', 'click'
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analytics', analyticsSchema);