import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectDatabase, checkDatabaseConnection } from './config/database.js';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { optionalAuth } from './middleware/auth.js';
import { setupApiDocs } from './middleware/apiDocs.js';
import { seedDatabase } from './services/staticDataService.js';

// Import routes
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import pcCentersRoutes from './routes/pc_centers.js';
import bookingsRoutes from './routes/bookings.js';
import reviewsRoutes from './routes/reviews.js';
import supportRoutes from './routes/support.js';
import adminRoutes from './routes/admin.js';

const app = express();
const httpServer = createServer(app);

// Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: { origin: config.frontendUrl, methods: ['GET', 'POST'], credentials: true },
  transports: ['websocket', 'polling'],
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root → API docs
app.get('/', (_req, res) => res.redirect('/api-docs'));

// API root info
app.get('/api', (_req, res) => {
  res.json({
    name: 'ECO Gaming Platform API',
    version: '1.0.0',
    endpoints: ['/api/auth', '/api/users', '/api/pc-centers', '/api/bookings', '/api/reviews'],
  });
});

// Health check
app.get('/health', async (_req, res) => {
  const dbConnected = await checkDatabaseConnection();
  res.json({
    status: 'ok',
    timestamp: new Date(),
    database: dbConnected ? 'connected' : 'disconnected',
    environment: config.nodeEnv,
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', optionalAuth, usersRoutes);
app.use('/api/pc-centers', optionalAuth, pcCentersRoutes);
app.use('/api/bookings', optionalAuth, bookingsRoutes);   // no forced auth for demo
app.use('/api/reviews', optionalAuth, reviewsRoutes);
app.use('/api/support', optionalAuth, supportRoutes);
app.use('/api/admin', optionalAuth, adminRoutes);

// API Documentation
setupApiDocs(app);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Error handler
app.use(errorHandler);

// ── Socket.IO Events ──────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on('join_pc_center', (data) => {
    socket.join(`pc_center_${data.pc_center_id}`);
  });

  socket.on('leave_pc_center', (data) => {
    socket.leave(`pc_center_${data.pc_center_id}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

export { io };

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = config.port;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Seed database from JSON data files if empty
    await seedDatabase();

    httpServer.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║      ECO Backend Server Running        ║
╚════════════════════════════════════════╝

🌐 Server:    http://localhost:${PORT}
🗄️  MongoDB:   ${config.mongodb.uri}/${config.mongodb.dbName}
⚡ Socket.IO: ws://localhost:${PORT}
📘 API Docs:  http://localhost:${PORT}/api-docs
🏥 Health:    http://localhost:${PORT}/health

Environment: ${config.nodeEnv}
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default httpServer;
