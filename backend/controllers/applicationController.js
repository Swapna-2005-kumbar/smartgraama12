const Application = require('../models/Application');
const Resident = require('../models/Resident');
const Scheme = require('../models/Scheme');

exports.createApplication = async (req, res) => {
  try {
    const { residentId, schemeId, aadhaar, rdNumber, rationCardNumber } = req.body;
    // Check eligibility (reuse eligibility logic or call eligibility endpoint)
    // For now, assume eligibility is checked on frontend
    const resident = await Resident.findById(residentId);
    const scheme = await Scheme.findById(schemeId);
    if (!resident || !scheme) {
      return res.status(404).json({ message: 'Resident or Scheme not found' });
    }
    // Optionally: Check if already applied
    const existing = await Application.findOne({ resident: residentId, scheme: schemeId });
    if (existing) {
      return res.status(400).json({ message: 'Already applied for this scheme.' });
    }
    const application = new Application({
      resident: residentId,
      scheme: schemeId,
      aadhaar,
      rdNumber,
      rationCardNumber
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('resident scheme reviewer');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('resident scheme reviewer');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.reviewApplication = async (req, res) => {
  try {
    if (!['admin', 'officer'].includes(req.userRole)) {
      return res.status(403).json({ message: 'Not authorized to review applications' });
    }
    const { status, reviewComment } = req.body;
    if (!['Under Review', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    application.status = status;
    application.reviewer = req.userId;
    application.reviewDate = new Date();
    application.reviewComment = reviewComment;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 