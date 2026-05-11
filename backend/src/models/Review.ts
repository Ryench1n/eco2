import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    pcCenterId: { type: String, ref: 'PCCenter', required: true },
    userId: { type: String, ref: 'User' },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model('Review', reviewSchema);
export default ReviewModel;
