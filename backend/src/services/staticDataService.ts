// ES6 module system — load static JSON data files via createRequire (ESM standard)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pcCentersData = require('../data/pcCenters.json');
const usersData = require('../data/users.json');
const bookingsData = require('../data/bookings.json');
const reviewsData = require('../data/reviews.json');

import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { UserModel } from '../models/User.js';
import { PCCenterModel } from '../models/PCCenter.js';
import { BookingModel } from '../models/Booking.js';
import { ReviewModel } from '../models/Review.js';

// ── Type definitions ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isVerified?: boolean;
  status?: string;
}

export interface PCCenter {
  id: string;
  ownerId?: string;
  name: string;
  address: string;
  image: string;
  totalSeats: number;
  seatCounts?: {
    hall: number;
    vip: number;
    stage: number;
  };
  rating: number;
  reviewCount: number;
  description: string;
  gears: {
    cpu: string;
    gpu: string;
    ram: string;
    monitor: string;
    keyboard: string;
    mouse: string;
    headset: string;
  };
  contactPhone: string;
  facebookPage: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  pricing: {
    hall: number;
    vip: number;
    stage: number;
  };
}

export interface Booking {
  id: string;
  userId?: string;
  pcCenterId: string;
  date: string;
  time: string;
  duration: number;
  seats: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Review {
  id: string;
  pcCenterId: string;
  userId?: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

// ── Database seeding from JSON ────────────────────────────────────────────────

export async function seedDatabase(): Promise<void> {
  // Seed PC Centers
  const centerCount = await PCCenterModel.countDocuments();
  if (centerCount === 0) {
    const centers = (pcCentersData as PCCenter[]).map((c) => ({ ...c, _id: c.id }));
    await PCCenterModel.insertMany(centers);
    console.log(`✅ Seeded ${centers.length} PC centers from JSON`);
  }

  // Seed Users
  const userCount = await UserModel.countDocuments();
  if (userCount === 0) {
    const users = await Promise.all(
      (usersData as Array<{ name: string; email: string; password: string; role: string }>).map(
        async (u, i) => ({
          _id: `user-${i + 1}`,
          name: u.name,
          email: u.email,
          passwordHash: await bcrypt.hash(u.password, 10),
          role: u.role,
          isVerified: true,
          status: 'active',
        })
      )
    );
    await UserModel.insertMany(users);
    console.log(`✅ Seeded ${users.length} users from JSON`);
  }

  // Seed Bookings (link to first user)
  const bookingCount = await BookingModel.countDocuments();
  if (bookingCount === 0) {
    const firstUser = await UserModel.findOne();
    const bookings = (bookingsData as Booking[]).map((b) => ({
      ...b,
      _id: b.id,
      userId: firstUser?._id,
    }));
    await BookingModel.insertMany(bookings);
    console.log(`✅ Seeded ${bookings.length} bookings from JSON`);
  }

  // Seed Reviews
  const reviewCount = await ReviewModel.countDocuments();
  if (reviewCount === 0) {
    const reviews = (reviewsData as Review[]).map((r) => ({ ...r, _id: r.id }));
    await ReviewModel.insertMany(reviews);
    console.log(`✅ Seeded ${reviews.length} reviews from JSON`);
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────

function generateId(prefix: string): string {
  return `${prefix}-${randomUUID()}`;
}

function toDate(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── User operations ───────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<User[]> {
  const docs = await UserModel.find().lean();
  return docs.map((d) => ({
    id: String(d._id),
    name: d.name,
    email: d.email,
    role: d.role,
    avatar: (d as { avatar?: string }).avatar || '',
    isVerified: d.isVerified,
    status: d.status,
  }));
}

export async function getUserById(id: string): Promise<User | undefined> {
  const doc = await UserModel.findById(id).lean();
  if (!doc) return undefined;
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    avatar: (doc as { avatar?: string }).avatar || '',
  };
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
  const doc = await new UserModel({
    _id: generateId('user'),
    ...userData,
  }).save();
  return { id: String(doc._id), name: String(doc.name), email: String(doc.email), role: String(doc.role) };
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
  const doc = await UserModel.findByIdAndUpdate(id, userData, { new: true }).lean();
  if (!doc) return undefined;
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    avatar: (doc as { avatar?: string }).avatar || '',
  };
}

export async function getPCCentersByOwnerId(ownerId: string): Promise<PCCenter[]> {
  const docs = await PCCenterModel.find({ ownerId }).lean();
  return docs.map((d) => ({ ...d, id: String(d._id) } as unknown as PCCenter));
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await UserModel.findByIdAndDelete(id);
  return !!result;
}

// ── PC Center operations ──────────────────────────────────────────────────────

export async function getAllPCCenters(): Promise<PCCenter[]> {
  const docs = await PCCenterModel.find().lean();
  return docs.map((d) => ({ ...d, id: String(d._id) } as unknown as PCCenter));
}

export async function getPCCenterById(id: string): Promise<PCCenter | undefined> {
  const doc = await PCCenterModel.findById(id).lean();
  if (!doc) return undefined;
  return { ...doc, id: String(doc._id) } as unknown as PCCenter;
}

export async function createPCCenter(centerData: Omit<PCCenter, 'id'>): Promise<PCCenter> {
  const doc = await new PCCenterModel({
    _id: generateId('pc'),
    ...centerData,
  }).save();
  const plain = doc.toObject();
  return { ...plain, id: String(plain._id) } as unknown as PCCenter;
}

export async function updatePCCenter(
  id: string,
  centerData: Partial<PCCenter>
): Promise<PCCenter | undefined> {
  const doc = await PCCenterModel.findByIdAndUpdate(id, centerData, { new: true }).lean();
  if (!doc) return undefined;
  return { ...doc, id: String(doc._id) } as unknown as PCCenter;
}

export async function deletePCCenter(id: string): Promise<boolean> {
  const result = await PCCenterModel.findByIdAndDelete(id);
  return !!result;
}

// ── Booking operations ────────────────────────────────────────────────────────

export async function getAllBookings(): Promise<Booking[]> {
  const docs = await BookingModel.find().lean();
  return docs.map((d) => ({ ...d, id: String(d._id) } as unknown as Booking));
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  const doc = await BookingModel.findById(id).lean();
  if (!doc) return undefined;
  return { ...doc, id: String(doc._id) } as unknown as Booking;
}

export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  const docs = await BookingModel.find({ userId }).lean();
  return docs.map((d) => ({ ...d, id: String(d._id) } as unknown as Booking));
}

export async function getBookingsByPCCenterId(pcCenterId: string): Promise<Booking[]> {
  const docs = await BookingModel.find({ pcCenterId }).lean();
  return docs.map((d) => ({ ...d, id: String(d._id) } as unknown as Booking));
}

export async function createBooking(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
  const doc = await new BookingModel({
    _id: generateId('booking'),
    ...bookingData,
  }).save();
  const plain = doc.toObject();
  return { ...plain, id: String(plain._id) } as unknown as Booking;
}

export async function updateBooking(
  id: string,
  bookingData: Partial<Booking>
): Promise<Booking | undefined> {
  const doc = await BookingModel.findByIdAndUpdate(id, bookingData, { new: true }).lean();
  if (!doc) return undefined;
  return { ...doc, id: String(doc._id) } as unknown as Booking;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const result = await BookingModel.findByIdAndDelete(id);
  return !!result;
}

// ── Review operations ─────────────────────────────────────────────────────────

export async function getAllReviews(): Promise<Review[]> {
  const docs = await ReviewModel.find().lean();
  return docs.map((d) => ({ ...d, id: String(d._id) } as unknown as Review));
}

export async function getReviewsByPCCenterId(pcCenterId: string): Promise<Review[]> {
  const docs = await ReviewModel.find({ pcCenterId }).lean();
  return docs.map((d) => ({ ...d, id: String(d._id) } as unknown as Review));
}

export async function createReview(reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> {
  const doc = await new ReviewModel({
    _id: generateId('review'),
    ...reviewData,
    date: toDate(),
  }).save();
  const plain = doc.toObject();
  return { ...plain, id: String(plain._id) } as unknown as Review;
}

export async function deleteReview(id: string): Promise<boolean> {
  const result = await ReviewModel.findByIdAndDelete(id);
  return !!result;
}
