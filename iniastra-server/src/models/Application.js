import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Student name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    country: String,
    postalCode: String
  },
  gpa: {
    type: Number,
    required: [true, 'GPA is required'],
    min: [0, 'GPA cannot be negative'],
    max: [4.0, 'GPA cannot exceed 4.0']
  },
  ielts: {
    type: Number,
    required: [true, 'IELTS score is required'],
    min: [0, 'IELTS score cannot be negative'],
    max: [9, 'IELTS score cannot exceed 9']
  },
  greScore: {
    verbal: Number,
    quantitative: Number,
    analytical: Number
  },
  academicBackground: {
    degree: String,
    institution: String,
    yearOfCompletion: Number,
    major: String
  },
  workExperience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  statementOfPurpose: {
    type: String,
    maxlength: [2000, 'Statement of purpose cannot exceed 2000 characters']
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: [true, 'University ID is required']
  },
  programApplied: {
    type: String,
    trim: true
  },
  applicationFee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: {
      values: ['submitted', 'under_review', 'shortlisted', 'accepted', 'rejected', 'waitlisted'],
      message: 'Status must be one of: submitted, under_review, shortlisted, accepted, rejected, waitlisted'
    },
    default: 'submitted'
  },
  statusHistory: [{
    status: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  documents: [{
    documentType: String,
    documentUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: [{
    note: String,
    reviewer: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  interviewDate: {
    type: Date
  },
  decisionDate: {
    type: Date
  },
  scholarshipOffered: {
    amount: Number,
    type: String,
    conditions: String
  },
  isEligible: {
    type: Boolean,
    default: true
  },
  eligibilityCheck: {
    passed: Boolean,
    checkedAt: Date,
    notes: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
applicationSchema.index({ email: 1 });
applicationSchema.index({ universityId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ isEligible: 1 });
applicationSchema.index({ 'academicBackground.institution': 1 });

// Virtual for university details
applicationSchema.virtual('university', {
  ref: 'University',
  localField: 'universityId',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to add status to history
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      notes: 'Status updated'
    });
  }
  this.updatedAt = Date.now();
  next();
});

// Method to check eligibility
applicationSchema.methods.checkEligibility = async function(university) {
  const isEligible = 
    this.gpa >= university.minGPA && 
    this.ielts >= university.minIELTS;
  
  this.isEligible = isEligible;
  this.eligibilityCheck = {
    passed: isEligible,
    checkedAt: new Date(),
    notes: isEligible ? 
      'Meets all eligibility criteria' : 
      `Failed eligibility: GPA (${this.gpa}/${university.minGPA}), IELTS (${this.ielts}/${university.minIELTS})`
  };
  
  return isEligible;
};

const Application = mongoose.model('Application', applicationSchema);

export default Application;