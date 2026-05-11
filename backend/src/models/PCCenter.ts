import mongoose from 'mongoose';

const pcCenterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    ownerId: { type: String, ref: 'User' },
    name: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80' },
    totalSeats: { type: Number, default: 35 },
    seatCounts: {
      hall: { type: Number, default: 0 },
      vip: { type: Number, default: 0 },
      stage: { type: Number, default: 0 },
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    gears: {
      cpu: String, gpu: String, ram: String,
      monitor: String, keyboard: String, mouse: String, headset: String,
    },
    contactPhone: { type: String, default: '' },
    facebookPage: { type: String, default: '' },
    openingHours: {
      monday: String, tuesday: String, wednesday: String,
      thursday: String, friday: String, saturday: String, sunday: String,
    },
    pricing: {
      hall: { type: Number, required: true },
      vip: { type: Number, required: true },
      stage: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export const PCCenterModel = mongoose.model('PCCenter', pcCenterSchema);
export default PCCenterModel;
