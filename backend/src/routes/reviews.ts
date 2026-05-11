import express from 'express';
import {
  getAllReviews,
  getReviewsByPCCenterId,
  createReview,
  deleteReview,
} from '../services/staticDataService.js';

export const reviewsRoutes = express.Router();

// GET /api/reviews  (filter by ?pcCenterId=)
reviewsRoutes.get('/', async (req, res) => {
  try {
    const { pcCenterId } = req.query;
    const reviews = pcCenterId
      ? await getReviewsByPCCenterId(pcCenterId as string)
      : await getAllReviews();
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve reviews' });
  }
});

// GET /api/reviews/:pcCenterId - Reviews by center
reviewsRoutes.get('/center/:pcCenterId', async (req, res) => {
  try {
    const reviews = await getReviewsByPCCenterId(req.params.pcCenterId);
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve reviews' });
  }
});

// POST /api/reviews
reviewsRoutes.post('/', async (req, res) => {
  try {
    const { pcCenterId, userName, userAvatar, rating, comment, userId } = req.body;

    if (!pcCenterId || !userName || !rating) {
      return res.status(400).json({ success: false, error: 'pcCenterId, userName, rating шаардлагатай' });
    }

    const review = await createReview({
      pcCenterId,
      userId,
      userName,
      userAvatar: userAvatar || '',
      rating: Number(rating),
      comment: comment || '',
    });

    res.status(201).json({ success: true, data: review });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to create review' });
  }
});

// DELETE /api/reviews/:id
reviewsRoutes.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteReview(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to delete review' });
  }
});

export default reviewsRoutes;
