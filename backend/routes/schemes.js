const express = require('express');
const { body, validationResult } = require('express-validator');
const Scheme = require('../models/Scheme');
const auth = require('../middleware/auth');

const router = express.Router();

// 📥 Create a new scheme
router.post(
  '/',
  auth,
  [
    body('name').notEmpty().withMessage('Scheme name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('eligibility').notEmpty().withMessage('Eligibility criteria are required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const scheme = new Scheme(req.body);
      await scheme.save();
      res.status(201).json(scheme);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// 📄 Get all schemes
router.get('/', auth, async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔄 Update a scheme
router.put('/:id', auth, async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ❌ Delete a scheme
router.delete('/:id', auth, async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.json({ message: 'Scheme deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
