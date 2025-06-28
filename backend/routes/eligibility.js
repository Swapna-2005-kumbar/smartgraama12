const express = require('express');
const { body, validationResult } = require('express-validator');
const Resident = require('../models/Resident');
const Scheme = require('../models/Scheme');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  auth,
  [body('residentId').notEmpty(), body('schemeId').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { residentId, schemeId } = req.body;

    try {
      const resident = await Resident.findById(residentId);
      const scheme = await Scheme.findById(schemeId);

      if (!resident || !scheme) {
        return res.status(404).json({ message: 'Resident or Scheme not found' });
      }

      if (scheme.status !== 'Active') {
        return res.json({
          eligible: false,
          reason: `Scheme ${scheme.name} is not currently active (Status: ${scheme.status})`
        });
      }

      // Check eligibility based on scheme criteria
      const eligibilityCriteria = scheme.eligibilityCriteria;
      const reasons = [];

      // Check income criteria
      if (eligibilityCriteria.maxIncome && resident.income > eligibilityCriteria.maxIncome) {
        reasons.push(`Income (₹${resident.income.toLocaleString()}) exceeds maximum limit (₹${eligibilityCriteria.maxIncome.toLocaleString()})`);
      }

      // Check age criteria
      if (eligibilityCriteria.ageMin && resident.age < eligibilityCriteria.ageMin) {
        reasons.push(`Age (${resident.age}) is below minimum requirement (${eligibilityCriteria.ageMin})`);
      }

      if (eligibilityCriteria.ageMax && resident.age > eligibilityCriteria.ageMax) {
        reasons.push(`Age (${resident.age}) is above maximum requirement (${eligibilityCriteria.ageMax})`);
      }

      // Check category criteria
      if (eligibilityCriteria.categories && eligibilityCriteria.categories.length > 0) {
        if (!eligibilityCriteria.categories.includes(resident.category)) {
          reasons.push(`Category (${resident.category}) is not eligible for this scheme`);
        }
      }

      // Check house ownership criteria
      if (eligibilityCriteria.mustNotHaveHouse && resident.hasHouse) {
        reasons.push('Scheme requires not owning a house');
      }

      // Check land size criteria
      if (eligibilityCriteria.maxLandSize && resident.landSize > eligibilityCriteria.maxLandSize) {
        reasons.push(`Land size (${resident.landSize} acres) exceeds maximum limit (${eligibilityCriteria.maxLandSize} acres)`);
      }

      // Check if scheme has reached target beneficiaries
      if (scheme.beneficiaries >= scheme.targetBeneficiaries) {
        reasons.push('Scheme has reached maximum number of beneficiaries');
      }

      const isEligible = reasons.length === 0;
      const reason = isEligible 
        ? `Eligible for ${scheme.name} - All criteria met`
        : `Not eligible for ${scheme.name}: ${reasons.join(', ')}`;

      res.json({
        eligible: isEligible,
        reason: reason,
        schemeName: scheme.name,
        residentName: resident.name,
        criteria: eligibilityCriteria
      });
    } catch (err) {
      console.error('Eligibility check error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
