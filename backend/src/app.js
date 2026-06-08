import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import entitiesRouter from './routes/entities.js';
import integrationsRouter from './routes/integrations.js';
import appsRouter from './routes/apps.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRouter);
app.use('/api/entities', entitiesRouter);
app.use('/api/integrations', integrationsRouter);
app.use('/api/apps', appsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SMACom backend is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

export default app;
