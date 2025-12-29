import express from 'express';
import {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  assignApplication,
  addReviewNotes,
  getApplicationStats,
  getStudentApplications
} from '../controllers/ApplicationController.js';
// import { protect, restrictTo, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', submitApplication);
router.get('/student/:email', getStudentApplications);

// Protected routes (Admin/Staff only)
// router.use(protect);
// router.use(restrictTo('admin', 'reviewer', 'admission_officer'));

router.get('/', getApplications);
router.get('/stats/overview', getApplicationStats);
router.get('/:id', getApplicationById);
router.patch('/:id/status', updateApplicationStatus);
// router.patch('/:id/assign', restrictTo('admin'), assignApplication);
router.patch('/:id/assign', assignApplication);
router.post('/:id/notes', addReviewNotes);

export default router;