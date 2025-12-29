import University from '../models/University.js';
import Application from '../models/Application.js';

/**
 * @desc    Get all universities with filtering and pagination
 * @route   GET /api/universities
 * @access  Public
 */
export const getUniversities = async (req, res) => {
  try {
    const {
      country,
      degree,
      minFee = 0,
      maxFee = 50000,
      minGPA,
      maxGPA = 4.0,
      minIELTS,
      maxIELTS = 9,
      search,
      page = 1,
      limit = 10,
      sort = 'name',
      order = 'asc'
    } = req.query;

    // Build query
    const query = {
      tuitionFee: { $gte: Number(minFee), $lte: Number(maxFee) }
    };

    // Add optional filters
    if (country && country !== 'All') query.country = country;
    if (degree && degree !== 'All') query.degreeLevel = degree;
    if (minGPA) query.minGPA = { $gte: Number(minGPA) };
    if (maxGPA) query.minGPA = { ...query.minGPA, $lte: Number(maxGPA) };
    if (minIELTS) query.minIELTS = { $gte: Number(minIELTS) };
    if (maxIELTS) query.minIELTS = { ...query.minIELTS, $lte: Number(maxIELTS) };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Sort
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sort] = sortOrder;

    // Execute query with pagination
    const [universities, total] = await Promise.all([
      University.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      University.countDocuments(query)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      status: 'success',
      count: universities.length,
      total,
      totalPages,
      currentPage: Number(page),
      hasNextPage,
      hasPrevPage,
      data: universities
    });

  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching universities',
      error: error.message
    });
  }
};

/**
 * @desc    Get single university by ID
 * @route   GET /api/universities/:id
 * @access  Public
 */
export const getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id)
      .populate('applicationCount')
      .lean();

    if (!university) {
      return res.status(404).json({
        status: 'error',
        message: 'University not found'
      });
    }

    // Get similar universities
    const similarUniversities = await University.find({
      country: university.country,
      degreeLevel: university.degreeLevel,
      _id: { $ne: university._id }
    })
      .limit(3)
      .select('name country tuitionFee minGPA minIELTS')
      .lean();

    res.status(200).json({
      status: 'success',
      data: {
        ...university,
        similarUniversities
      }
    });

  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching university',
      error: error.message
    });
  }
};

/**
 * @desc    Create new university (Admin only)
 * @route   POST /api/universities
 * @access  Private/Admin
 */
export const createUniversity = async (req, res) => {
  try {
    const university = await University.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'University created successfully',
      data: university
    });

  } catch (error) {
    console.error('Error creating university:', error);
    res.status(400).json({
      status: 'error',
      message: 'Error creating university',
      error: error.message
    });
  }
};

/**
 * @desc    Update university (Admin only)
 * @route   PUT /api/universities/:id
 * @access  Private/Admin
 */
export const updateUniversity = async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({
        status: 'error',
        message: 'University not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'University updated successfully',
      data: university
    });

  } catch (error) {
    console.error('Error updating university:', error);
    res.status(400).json({
      status: 'error',
      message: 'Error updating university',
      error: error.message
    });
  }
};

/**
 * @desc    Delete university (Admin only)
 * @route   DELETE /api/universities/:id
 * @access  Private/Admin
 */
export const deleteUniversity = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({
        status: 'error',
        message: 'University not found'
      });
    }

    // Soft delete by marking as inactive
    university.isActive = false;
    await university.save();

    res.status(200).json({
      status: 'success',
      message: 'University deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting university:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting university',
      error: error.message
    });
  }
};

/**
 * @desc    Get university statistics
 * @route   GET /api/universities/stats/overview
 * @access  Private/Admin
 */
export const getUniversityStats = async (req, res) => {
  try {
    const stats = await University.aggregate([
      {
        $group: {
          _id: null,
          totalUniversities: { $sum: 1 },
          averageTuition: { $avg: '$tuitionFee' },
          minTuition: { $min: '$tuitionFee' },
          maxTuition: { $max: '$tuitionFee' },
          averageGPA: { $avg: '$minGPA' },
          averageIELTS: { $avg: '$minIELTS' }
        }
      },
      {
        $project: {
          _id: 0,
          totalUniversities: 1,
          averageTuition: { $round: ['$averageTuition', 2] },
          minTuition: 1,
          maxTuition: 1,
          averageGPA: { $round: ['$averageGPA', 2] },
          averageIELTS: { $round: ['$averageIELTS', 2] }
        }
      }
    ]);

    // Count by country
    const countries = await University.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Count by degree level
    const degrees = await University.aggregate([
      { $group: { _id: '$degreeLevel', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overview: stats[0] || {},
        byCountry: countries,
        byDegree: degrees
      }
    });

  } catch (error) {
    console.error('Error fetching university stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching university statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Check student eligibility for a university
 * @route   POST /api/universities/:id/check-eligibility
 * @access  Public
 */
export const checkEligibility = async (req, res) => {
  try {
    const { gpa, ielts } = req.body;
    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({
        status: 'error',
        message: 'University not found'
      });
    }

    const isEligible = gpa >= university.minGPA && ielts >= university.minIELTS;
    const reasons = [];

    if (gpa < university.minGPA) {
      reasons.push(`Your GPA (${gpa}) is below the minimum requirement (${university.minGPA})`);
    }
    if (ielts < university.minIELTS) {
      reasons.push(`Your IELTS score (${ielts}) is below the minimum requirement (${university.minIELTS})`);
    }

    res.status(200).json({
      status: 'success',
      data: {
        isEligible,
        university: {
          name: university.name,
          minGPA: university.minGPA,
          minIELTS: university.minIELTS
        },
        student: { gpa, ielts },
        reasons: isEligible ? ['All requirements met'] : reasons,
        suggestions: !isEligible ? [
          'Consider improving your test scores',
          'Look for universities with lower requirements',
          'Consider taking additional courses to improve your profile'
        ] : []
      }
    });

  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error checking eligibility',
      error: error.message
    });
  }
};

/**
 * @desc    Get universities by filters for comparison
 * @route   GET /api/universities/compare
 * @access  Public
 */
export const getUniversitiesForComparison = async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({
        status: 'error',
        message: 'University IDs are required for comparison'
      });
    }

    const idArray = ids.split(',').slice(0, 5); // Limit to 5 universities

    const universities = await University.find({
      _id: { $in: idArray }
    })
      .select('name country degreeLevel minGPA minIELTS tuitionFee programs ranking website description')
      .lean();

    if (universities.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'At least 2 universities are required for comparison'
      });
    }

    res.status(200).json({
      status: 'success',
      count: universities.length,
      data: universities
    });

  } catch (error) {
    console.error('Error fetching universities for comparison:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching universities for comparison',
      error: error.message
    });
  }
};