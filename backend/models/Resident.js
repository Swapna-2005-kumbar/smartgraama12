const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aadhaar: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  category: { type: String, enum: ['General', 'SC', 'ST', 'OBC'], required: true },
  income: { type: Number, required: true },
  education: { type: String },
  hasHouse: { type: Boolean, default: false },
  landSize: { type: Number, default: 0 },
  schemes: [{ type: String }],
  status: { type: String, enum: ['Active', 'Pending', 'Inactive'], default: 'Active' },
  joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Resident', residentSchema);
