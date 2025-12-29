import Application from '../models/Application.js';
import University from '../models/University.js';

/**
 * @desc    Submit new application
 * @route   POST /api/applications
 * @access  Public
 */
export const submitApplication = async (req, res) => {
  try {
    const { studentName, email, gpa, ielts, universityId, ...otherData } = req.body;

    // Validate required fields
    if (!studentName || !email || !gpa || !ielts || !universityId) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: studentName, email, gpa, ielts, universityId'
      });
    }

    // Check if university exists
    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({
        status: 'error',
        message: 'University not found'
      });
    }

    // Check for duplicate application (same email for same university within last 30 days)
    const recentApplication = await Application.findOne({
      email,
      universityId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 30 days
    });

    if (recentApplication) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already applied to this university recently. Please wait 30 days before applying again.'
      });
    }

    // Check eligibility
    const isEligible = gpa >= university.minGPA && ielts >= university.minIELTS;
    
    if (!isEligible) {
      return res.status(400).json({
        status: 'error',
        message: 'Not eligible for this university',
        data: {
          studentGPA: gpa,
          requiredGPA: university.minGPA,
          studentIELTS: ielts,
          requiredIELTS: university.minIELTS,
          suggestions: [
            'Consider improving your test scores',
            'Look for universities with lower requirements',
            'Contact university admission office for special consideration'
          ]
        }
      });
    }

    // Create application
    const application = await Application.create({
      studentName,
      email,
      gpa,
      ielts,
      universityId,
      ...otherData,
      isEligible: true,
      eligibilityCheck: {
        passed: true,
        checkedAt: new Date(),
        notes: 'Meets all eligibility criteria'
      }
    });

    // Populate university data
    await application.populate('university', 'name country');

    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate application detected'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error submitting application',
      error: error.message
    });
  }
};

/**
 * @desc    Get all applications (with filters)
 * @route   GET /api/applications
 * @access  Private/Admin
 */
export const getApplications = async (req, res) => {
  try {
    const {
      status,
      universityId,
      email,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (universityId) query.universityId = universityId;
    if (email) query.email = email;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('university', 'name country')
        .populate('assignedTo', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Application.countDocuments(query)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      status: 'success',
      count: applications.length,
      total,
      totalPages,
      currentPage: Number(page),
      hasNextPage,
      hasPrevPage,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

/**
 * @desc    Get single application by ID
 * @route   GET /api/applications/:id
 * @access  Private/Admin
 */
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('university')
      .populate('assignedTo', 'name email role')
      .lean();

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: application
    });

  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching application',
      error: error.message
    });
  }
};

/**
 * @desc    Update application status
 * @route   PATCH /api/applications/:id/status
 * @access  Private/Admin
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Status is required'
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    // Update status
    application.status = status;
    
    // Add to status history
    application.statusHistory.push({
      status,
      notes: notes || `Status changed to ${status}`
    });

    // Set decision date if accepted or rejected
    if (['accepted', 'rejected'].includes(status)) {
      application.decisionDate = new Date();
    }

    await application.save();

    // Populate for response
    await application.populate('university', 'name');

    res.status(200).json({
      status: 'success',
      message: `Application status updated to ${status}`,
      data: application
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating application status',
      error: error.message
    });
  }
};

/**
 * @desc    Assign application to reviewer
 * @route   PATCH /api/applications/:id/assign
 * @access  Private/Admin
 */
export const assignApplication = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        status: 'error',
        message: 'Reviewer ID is required'
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo,
        status: 'under_review'
      },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Application assigned successfully',
      data: application
    });

  } catch (error) {
    console.error('Error assigning application:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error assigning application',
      error: error.message
    });
  }
};

/**
 * @desc    Add review notes to application
 * @route   POST /api/applications/:id/notes
 * @access  Private/Admin
 */
export const addReviewNotes = async (req, res) => {
  try {
    const { note, reviewer } = req.body;

    if (!note || !reviewer) {
      return res.status(400).json({
        status: 'error',
        message: 'Note and reviewer name are required'
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    application.reviewNotes.push({
      note,
      reviewer
    });

    await application.save();

    res.status(200).json({
      status: 'success',
      message: 'Review note added successfully',
      data: {
        notes: application.reviewNotes
      }
    });

  } catch (error) {
    console.error('Error adding review notes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding review notes',
      error: error.message
    });
  }
};

/**
 * @desc    Get application statistics
 * @route   GET /api/applications/stats/overview
 * @access  Private/Admin
 */
export const getApplicationStats = async (req, res) => {
  try {
    // Overall stats
    const overallStats = await Application.aggregate([
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          eligibleApplications: { $sum: { $cond: ['$isEligible', 1, 0] } },
          averageGPA: { $avg: '$gpa' },
          averageIELTS: { $avg: '$ielts' },
          totalTuition: { $sum: '$applicationFee' }
        }
      },
      {
        $project: {
          _id: 0,
          totalApplications: 1,
          eligibleApplications: 1,
          ineligibleApplications: { $subtract: ['$totalApplications', '$eligibleApplications'] },
          eligibilityRate: {
            $multiply: [
              { $divide: ['$eligibleApplications', '$totalApplications'] },
              100
            ]
          },
          averageGPA: { $round: ['$averageGPA', 2] },
          averageIELTS: { $round: ['$averageIELTS', 2] },
          totalTuition: 1
        }
      }
    ]);

    // Applications by status
    const byStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Applications by university
    const byUniversity = await Application.aggregate([
      {
        $group: {
          _id: '$universityId',
          count: { $sum: 1 },
          averageGPA: { $avg: '$gpa' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Populate university names
    const universityIds = byUniversity.map(item => item._id);
    const universities = await University.find({ _id: { $in: universityIds } })
      .select('name country')
      .lean();

    const byUniversityWithNames = byUniversity.map(item => {
      const uni = universities.find(u => u._id.toString() === item._id.toString());
      return {
        ...item,
        universityName: uni ? uni.name : 'Unknown',
        country: uni ? uni.country : 'Unknown'
      };
    });

    // Monthly trend
    const monthlyTrend = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overview: overallStats[0] || {},
        byStatus,
        byUniversity: byUniversityWithNames,
        monthlyTrend
      }
    });

  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching application statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get applications by email (for students to track their applications)
 * @route   GET /api/applications/student/:email
 * @access  Public
 */
export const getStudentApplications = async (req, res) => {
  try {
    const { email } = req.params;
    
    const applications = await Application.find({ email })
      .populate('university', 'name country logoUrl')
      .sort('-createdAt')
      .lean();

    res.status(200).json({
      status: 'success',
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching student applications',
      error: error.message
    });
  }
};