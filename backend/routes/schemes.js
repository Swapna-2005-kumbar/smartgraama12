const express = require('express');
const { body, validationResult } = require('express-validator');
const Scheme = require('../models/Scheme');
const auth = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 📥 Create a new scheme
router.post(
  '/',
  auth,
  [
    body('name').notEmpty().withMessage('Scheme name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('eligibilityCriteria').notEmpty().withMessage('Eligibility criteria are required')
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

// Application route
router.post(
  '/applications',
  auth,
  applicationController.createApplication
);

// Application review/approval routes
router.get('/applications', auth, applicationController.getAllApplications);
router.get('/applications/:id', auth, applicationController.getApplication);
router.patch('/applications/:id/review', auth, applicationController.reviewApplication);

module.exports = router;
