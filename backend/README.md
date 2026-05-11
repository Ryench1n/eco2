# ECO Platform - Backend API

Node.js + Express backend for the ECO gaming center booking platform.

## Tech Stack

- Node.js 20 + Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
cd backend
npm install
```

### Configure environment

```bash
cp .env.example .env
# Edit .env with your MongoDB connection string
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Server & database status |
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/pc-centers | List all PC centers |
| GET | /api/pc-centers/:id | Get PC center by ID |
| GET | /api/bookings | List bookings |
| POST | /api/bookings | Create booking |
| GET | /api/reviews/center/:id | Get reviews for a center |
| POST | /api/reviews | Add review |

## Environment Variables

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=3000
NODE_ENV=production
```
