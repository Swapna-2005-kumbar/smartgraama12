const express = require('express');
const Resident = require('../models/Resident');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all residents
router.get('/', auth, async (req, res) => {
  try {
    const residents = await Resident.find().sort({ createdAt: -1 });
    res.json(residents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create resident
router.post('/', auth, async (req, res) => {
  try {
    const resident = new Resident(req.body);
    await resident.save();
    res.status(201).json(resident);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Aadhaar number already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update resident
router.put('/:id', auth, async (req, res) => {
  try {
    const resident = await Resident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    
    res.json(resident);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resident
router.delete('/:id', auth, async (req, res) => {
  try {
    const resident = await Resident.findByIdAndDelete(req.params.id);
    
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    
    res.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
