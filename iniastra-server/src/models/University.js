import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    trim: true,
    maxlength: [100, 'University name cannot exceed 100 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  degreeLevel: {
    type: String,
    required: [true, 'Degree level is required'],
    enum: {
      values: ['Bachelors', 'Masters', 'PhD', 'Diploma'],
      message: 'Degree level must be one of: Bachelors, Masters, PhD, Diploma'
    }
  },
  programs: [{
    type: String,
    trim: true
  }],
  minGPA: {
    type: Number,
    required: [true, 'Minimum GPA is required'],
    min: [0, 'GPA cannot be negative'],
    max: [4.0, 'GPA cannot exceed 4.0']
  },
  minIELTS: {
    type: Number,
    required: [true, 'Minimum IELTS score is required'],
    min: [0, 'IELTS score cannot be negative'],
    max: [9, 'IELTS score cannot exceed 9']
  },
  tuitionFee: {
    type: Number,
    required: [true, 'Tuition fee is required'],
    min: [0, 'Tuition fee cannot be negative']
  },
  scholarshipsAvailable: {
    type: Boolean,
    default: false
  },
  applicationDeadline: {
    type: Date
  },
  intakeSeasons: [{
    type: String,
    enum: ['Fall', 'Spring', 'Summer', 'Winter']
  }],
  ranking: {
    type: Number,
    min: 1
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please enter a valid URL']
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  logoUrl: {
    type: String,
    trim: true
  },
  campusPhotos: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
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

// Indexes for better query performance
universitySchema.index({ country: 1, degreeLevel: 1 });
universitySchema.index({ tuitionFee: 1 });
universitySchema.index({ minGPA: 1 });
universitySchema.index({ minIELTS: 1 });
universitySchema.index({ name: 'text', description: 'text', programs: 'text' });

// Virtual for number of applications
universitySchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'universityId',
  count: true
});

// Update timestamp before saving
universitySchema.pre('save', function() {
  this.updatedAt = Date.now();

});

// Query middleware to filter only active universities
universitySchema.pre(/^find/, function() {
  this.find({ isActive: { $ne: false } });

});

const University = mongoose.model('University', universitySchema);

export default University;