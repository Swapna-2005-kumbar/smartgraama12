const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  eligibilityCriteria: {
    maxIncome: { type: Number },
    ageMin: { type: Number },
    ageMax: { type: Number },
    categories: [{ type: String }],
    mustNotHaveHouse: { type: Boolean },
    maxLandSize: { type: Number }
  },
  budget: { type: Number, required: true },
  utilized: { type: Number, default: 0 },
  beneficiaries: { type: Number, default: 0 },
  targetBeneficiaries: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Pending', 'Completed', 'Suspended'], default: 'Active' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);
