import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import memberRoutes from './routes/member.routes';
import wilayahRoutes from './routes/wilayah.routes';
// import authRoutes from './routes/auth.routes';
// import userRoutes from './routes/user.routes';
// import { errorHandler } from './utils/errorHandler';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/wilayah', wilayahRoutes);
// app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;