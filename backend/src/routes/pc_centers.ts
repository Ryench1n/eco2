import express from 'express';
import {
  getAllPCCenters,
  getPCCenterById,
  getPCCentersByOwnerId,
  createPCCenter,
  updatePCCenter,
  deletePCCenter,
} from '../services/staticDataService.js';

export const pcCentersRoutes = express.Router();

// GET /api/pc-centers  (filter by ?ownerId=)
pcCentersRoutes.get('/', async (req, res) => {
  try {
    const { ownerId } = req.query;
    const centers = ownerId
      ? await getPCCentersByOwnerId(ownerId as string)
      : await getAllPCCenters();
    res.json({ success: true, data: centers, message: 'PC centers retrieved successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve PC centers' });
  }
});

// GET /api/pc-centers/:id
pcCentersRoutes.get('/:id', async (req, res) => {
  try {
    const center = await getPCCenterById(req.params.id);
    if (!center) {
      return res.status(404).json({ success: false, error: 'PC center not found' });
    }
    res.json({ success: true, data: center });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve PC center' });
  }
});

// POST /api/pc-centers
pcCentersRoutes.post('/', async (req, res) => {
  try {
    const {
      name, address, image, totalSeats, seatCounts, rating, reviewCount,
      description, gears, contactPhone, facebookPage, openingHours, pricing, ownerId,
    } = req.body;

    if (!name || !address || !pricing) {
      return res.status(400).json({ success: false, error: 'name, address, pricing шаардлагатай' });
    }

    const newCenter = await createPCCenter({
      name,
      address,
      image: image || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
      totalSeats: totalSeats || 35,
      seatCounts: seatCounts || { hall: 0, vip: 0, stage: 0 },
      rating: rating || 0,
      reviewCount: reviewCount || 0,
      description: description || '',
      gears: gears || {
        cpu: 'Intel Core i7', gpu: 'NVIDIA RTX 3070', ram: '16GB DDR4',
        monitor: '144Hz Gaming Monitor', keyboard: 'RGB Gaming Keyboard',
        mouse: 'Gaming Mouse', headset: 'Gaming Headset',
      },
      contactPhone: contactPhone || '',
      facebookPage: facebookPage || '',
      openingHours: openingHours || {
        monday: '10:00 - 23:00', tuesday: '10:00 - 23:00', wednesday: '10:00 - 23:00',
        thursday: '10:00 - 23:00', friday: '10:00 - 01:00',
        saturday: '10:00 - 01:00', sunday: '10:00 - 23:00',
      },
      pricing,
      ownerId,
    });

    res.status(201).json({ success: true, data: newCenter });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to create PC center' });
  }
});

// PUT /api/pc-centers/:id
pcCentersRoutes.put('/:id', async (req, res) => {
  try {
    const updatedCenter = await updatePCCenter(req.params.id, req.body);
    if (!updatedCenter) {
      return res.status(404).json({ success: false, error: 'PC center not found' });
    }
    res.json({ success: true, data: updatedCenter });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to update PC center' });
  }
});

// DELETE /api/pc-centers/:id
pcCentersRoutes.delete('/:id', async (req, res) => {
  try {
    const deleted = await deletePCCenter(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'PC center not found' });
    }
    res.json({ success: true, message: 'PC center deleted successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to delete PC center' });
  }
});

export default pcCentersRoutes;
