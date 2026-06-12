const Complaint = require('../models/Complaint');
const fs = require('fs');
const path = require('path');

// @desc    Create complaint
// @route   POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description and category are required' });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      createdBy: req.user._id
    });

    await complaint.populate('createdBy', 'name email');
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints (admin sees all, user sees own)
// @route   GET /api/complaints
const getComplaints = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      complaints,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('createdBy', 'name email phone');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Users can only see their own complaints
    if (req.user.role !== 'admin' && complaint.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status (admin)
// @route   PUT /api/complaints/:id/status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status || complaint.status;
    complaint.adminNote = adminNote || complaint.adminNote;

    if (req.file) {
      complaint.solvedImage = `/uploads/${req.file.filename}`;
    }

    await complaint.save();
    await complaint.populate('createdBy', 'name email');
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Admins can delete any; users can delete their own pending
    if (req.user.role !== 'admin' && complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Clean up uploaded files
    if (complaint.image) {
      const imgPath = path.join(__dirname, '..', complaint.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    if (complaint.solvedImage) {
      const imgPath = path.join(__dirname, '..', complaint.solvedImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint stats
// @route   GET /api/complaints/stats
const getStats = async (req, res) => {
  try {
    const query = req.user.role !== 'admin' ? { createdBy: req.user._id } : {};

    const [total, pending, inProgress, solved] = await Promise.all([
      Complaint.countDocuments(query),
      Complaint.countDocuments({ ...query, status: 'Pending' }),
      Complaint.countDocuments({ ...query, status: 'In Progress' }),
      Complaint.countDocuments({ ...query, status: 'Solved' })
    ]);

    const byCategory = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({ total, pending, inProgress, solved, byCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaintStatus,
  deleteComplaint,
  getStats
};
