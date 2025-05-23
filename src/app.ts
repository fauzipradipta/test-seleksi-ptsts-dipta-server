import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import userRoutes from './routes/user.routes';
import memberRoutes from './routes/member.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();

app.use(cors({

  origin: 'http://localhost:5173'

}));
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', memberRoutes);
app.use('/api', dashboardRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
export default app;
