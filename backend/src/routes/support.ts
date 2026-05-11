import express from 'express';

export const supportRoutes = express.Router();

// Placeholder routes - will be implemented
supportRoutes.get('/', (req, res) => {
  res.json({ message: 'List support tickets - coming soon' });
});

supportRoutes.post('/', (req, res) => {
  res.json({ message: 'Create support ticket - coming soon' });
});

export default supportRoutes;
