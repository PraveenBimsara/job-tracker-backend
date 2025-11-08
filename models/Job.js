import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    default: 'Full-time'
  },
  status: {
    type: String,
    enum: ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected', 'Accepted', 'Declined'],
    default: 'Wishlist'
  },
  applicationDate: {
    type: Date
  },
  interviewDate: {
    type: Date
  },
  notes: {
    type: String
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String
  },
  jobUrl: {
    type: String
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  color: {
    type: String,
    default: '#3b82f6'
  }
}, {
  timestamps: true
});

export default mongoose.model('Job', jobSchema);