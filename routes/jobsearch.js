import express from 'express';
import { searchJobs, getRecommendedJobs } from '../services/jobSearchService.js';
import { protect } from '../middleware/auth.js';
import Job from '../models/Job.js';

const router = express.Router();

// @route   GET /api/job-search
// @desc    Search external job boards
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { query = 'software engineer' } = req.query;
    
    const jobs = await searchJobs(query);
    
    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching jobs',
      error: error.message,
    });
  }
});

// @route   GET /api/job-search/recommendations
// @desc    Get personalized job recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    // Get user's existing jobs for smart matching
    const userJobs = await Job.find({ user: req.user._id });
    
    const recommendations = await getRecommendedJobs(userJobs);
    
    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message,
    });
  }
});

export default router;