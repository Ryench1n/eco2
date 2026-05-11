import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, ref: 'User' },
    pcCenterId: { type: String, ref: 'PCCenter', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 1 },
    seats: [{ type: String }],
    totalPrice: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model('Booking', bookingSchema);
export default BookingModel;
