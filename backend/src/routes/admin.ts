import express from 'express';

export const adminRoutes = express.Router();

// Placeholder routes - will be implemented
adminRoutes.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard - coming soon' });
});

adminRoutes.get('/users', (req, res) => {
  res.json({ message: 'Manage users - coming soon' });
});

export default adminRoutes;
