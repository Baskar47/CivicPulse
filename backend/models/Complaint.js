const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Road Damage', 'Garbage Issue', 'Water Leakage', 'Street Light Failure', 'Drainage Problem', 'Other']
  },
  image: {
    type: String,
    default: ''
  },
  solvedImage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Solved'],
    default: 'Pending'
  },
  location: {
    type: String,
    default: ''
  },
  adminNote: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
