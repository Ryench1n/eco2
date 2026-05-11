import express from 'express';
import {
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  getBookingsByPCCenterId,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../services/staticDataService.js';

export const bookingsRoutes = express.Router();

// GET /api/bookings  (filter by ?userId= or ?pcCenterId=)
bookingsRoutes.get('/', async (req, res) => {
  try {
    const { userId, pcCenterId } = req.query;

    let bookings;
    if (userId) {
      bookings = await getBookingsByUserId(userId as string);
    } else if (pcCenterId) {
      bookings = await getBookingsByPCCenterId(pcCenterId as string);
    } else {
      bookings = await getAllBookings();
    }

    res.json({ success: true, data: bookings, message: 'Bookings retrieved successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve bookings' });
  }
});

bookingsRoutes.get('/:id', async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to retrieve booking' });
  }
});

bookingsRoutes.post('/', async (req, res) => {
  try {
    const { userId, pcCenterId, date, time, duration, seats, totalPrice, status } = req.body;

    if (!pcCenterId || !date || !time) {
      return res.status(400).json({ success: false, error: 'pcCenterId, date, time шаардлагатай' });
    }

    const newBooking = await createBooking({
      userId,
      pcCenterId,
      date,
      time,
      duration: duration || 1,
      seats: seats || [],
      totalPrice: totalPrice || 0,
      status: status || 'pending',
    });

    res.status(201).json({ success: true, data: newBooking });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to create booking' });
  }
});

bookingsRoutes.put('/:id', async (req, res) => {
  try {
    const updatedBooking = await updateBooking(req.params.id, req.body);
    if (!updatedBooking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, data: updatedBooking });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to update booking' });
  }
});

bookingsRoutes.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteBooking(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to delete booking' });
  }
});

export default bookingsRoutes;
