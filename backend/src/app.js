// Builds the Express application: security middleware, JSON parsing, routes and error handling.
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import vehiclesRoutes from './routes/vehicles.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import statsRoutes from './routes/stats.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

app.set('trust proxy', 1); // Railway / Vercel sit behind a proxy (needed for correct IPs in rate limiting)
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

app.use('/api', apiLimiter);
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (_req, res) => res.json({ name: 'FreeWay API', docs: '/api/health' }));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
