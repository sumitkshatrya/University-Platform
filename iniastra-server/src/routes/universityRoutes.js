import express from 'express';
import {
  getUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getUniversityStats,
  checkEligibility,
  getUniversitiesForComparison
} from '../controllers/UniversityController.js';
// import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getUniversities);
router.get('/compare', getUniversitiesForComparison);
router.get('/:id', getUniversityById);
router.post('/:id/check-eligibility', checkEligibility);

// Admin only routes
// router.use(protect);
// router.use(restrictTo('admin'));

router.post('/', createUniversity);
router.put('/:id', updateUniversity);
router.delete('/:id', deleteUniversity);
router.get('/stats/overview', getUniversityStats);

export default router;