import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import heroRoutes from './api/hero.js';
import aboutRoutes from './api/about.js';
import skillsRoutes from './api/skills.js';
import projectsRoutes from './api/projects.js';
import experienceRoutes from './api/experience.js';
import testimonialsRoutes from './api/testimonials.js';
import blogRoutes from './api/blog.js';
import servicesRoutes from './api/services.js';
import socialLinksRoutes from './api/socialLinks.js';
import contactRoutes from './api/contact.js';
import settingsRoutes from './api/settings.js';
import authRoutes from './api/auth.js';
import adminRoutes from './api/admin.js';
import uploadRoutes from './api/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  'https://dagotshering.me',
  'https://www.dagotshering.me',
  'https://admin.dagotshering.me',   // ← added
  'http://localhost:5173',
  'http://localhost:5174',
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/social-links', socialLinksRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health\n`);
});
