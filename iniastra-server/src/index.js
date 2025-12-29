import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import universityRoutes from './routes/universityRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

/*  SECURITY (Helmet) */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

/*  CORS CONFIG (IMPORTANT) */
const allowedOrigins = [
  'http://localhost:5173',
  'https://university-platform-seven.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/*  RATE LIMITING */ 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use('/api', limiter);

/* BODY PARSER */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/*LOGGER */

app.use(morgan('dev'));

/* DATABASE */

connectDB();

/*  ROUTES */

app.use('/api/universities', universityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);

/* HEALTH CHECK */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'University Application API is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/*  ROOT */

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to University Application API',
    version: '1.0.0',
    endpoints: {
      universities: '/api/universities',
      applications: '/api/applications',
      users: '/api/users',
      health: '/api/health',
    },
  });
});

/* ERROR HANDLER */
app.use(errorHandler);

/*  404 HANDLER */
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

/* SERVER START */

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

/* GRACEFUL SHUTDOWN */

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    process.exit(0);
  });
});

export default app;
