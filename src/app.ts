import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import memberRoutes from './routes/member.routes';
import dashboardRoutes from './routes/dashboard.routes';
import domisiliRoutes from './routes/region.routes';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/domisili', domisiliRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
export default app;
