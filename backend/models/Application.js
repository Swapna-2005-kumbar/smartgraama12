const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  aadhaar: { type: String, required: true },
  rdNumber: { type: String, required: true },
  rationCardNumber: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], default: 'Pending' },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewDate: { type: Date },
  reviewComment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema); 