import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'banned', 'suspended'], default: 'active' },
    avatar: { type: String, default: '' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);
export default UserModel;
