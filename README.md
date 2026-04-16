# Fullstack Developer Portfolio

A comprehensive, fullstack developer portfolio with Node.js backend, PostgreSQL database, Drizzle ORM, and React frontend.

## 🏗️ Architecture

```
├── backend/          # Node.js + TypeScript + Express API
├── app/              # React + TypeScript + Vite Frontend
├── docker-compose.yml # Docker orchestration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)

### 1. Start with Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd portfolio

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp app/.env.example app/.env

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npx drizzle-kit migrate

# Seed the database
docker-compose exec backend npm run db:seed
```

### 2. Access the Application

- **Portfolio**: http://localhost:5173
- **API**: http://localhost:5000/api
- **pgAdmin**: http://localhost:5050
  - Email: admin@portfolio.com
  - Password: admin

### 3. Admin Panel

The admin panel is built into the frontend at `/admin` route.

**Default Credentials:**
- Email: `admin@portfolio.com`
- Password: `admin123`

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL 15
- **Authentication**: JWT

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP + Framer Motion
- **Icons**: Lucide React

### Database Schema

The database includes tables for:
- `hero` - Hero section content
- `about` - About section content
- `skills` - Skills with proficiency levels
- `projects` - Portfolio projects
- `experience` - Work experience
- `testimonials` - Client testimonials
- `blog_posts` - Blog articles
- `services` - Services offered
- `social_links` - Social media links
- `contact_messages` - Contact form submissions
- `site_settings` - Site-wide settings
- `admin_users` - Admin authentication

## 📁 Project Structure

### Backend (`/backend`)
```
src/
├── api/              # API route handlers
│   ├── auth.ts       # Authentication routes
│   ├── hero.ts       # Hero CRUD
│   ├── about.ts      # About CRUD
│   ├── skills.ts     # Skills CRUD
│   ├── projects.ts   # Projects CRUD
│   ├── experience.ts # Experience CRUD
│   ├── testimonials.ts
│   ├── blog.ts
│   ├── services.ts
│   ├── socialLinks.ts
│   ├── contact.ts
│   ├── settings.ts
│   └── admin.ts      # Admin dashboard
├── db/
│   ├── index.ts      # Database connection
│   ├── schema.ts     # Drizzle schema
│   └── seed.ts       # Seed data
├── middleware/
│   └── auth.ts       # JWT authentication
├── types/
│   └── index.ts      # TypeScript types
├── utils/
│   └── helpers.ts    # Utility functions
└── server.ts         # Express server
```

### Frontend (`/app`)
```
src/
├── sections/         # Page sections
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Experience.tsx
│   ├── Testimonials.tsx
│   ├── Services.tsx
│   ├── Blog.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── components/       # Reusable components
├── hooks/            # Custom hooks
│   ├── useData.ts    # Data fetching hooks
│   └── useScrollAnimation.ts
├── lib/
│   └── api.ts        # API client
├── config.ts         # Static configuration
└── App.tsx
```

## 🔌 API Endpoints

### Public Endpoints
```
GET  /api/health           # Health check
GET  /api/hero             # Get hero data
GET  /api/about            # Get about data
GET  /api/skills           # Get all skills
GET  /api/projects         # Get all projects
GET  /api/projects/:slug   # Get single project
GET  /api/experience       # Get all experience
GET  /api/testimonials     # Get all testimonials
GET  /api/blog             # Get all blog posts
GET  /api/blog/:slug       # Get single blog post
GET  /api/services         # Get all services
GET  /api/social-links     # Get all social links
GET  /api/settings         # Get site settings
POST /api/contact          # Submit contact form
```

### Protected Endpoints (Require JWT)
```
POST /api/auth/login
POST /api/auth/register

PUT  /api/hero
PUT  /api/about
POST /api/skills
PUT  /api/skills/:id
DELETE /api/skills/:id

# ... and similar CRUD for all resources

GET  /api/admin/dashboard  # Get dashboard stats
GET  /api/admin/content    # Get all content
GET  /api/contact          # Get contact messages
```

## 📝 Environment Variables

### Root `.env`
```env
POSTGRES_USER=portfolio
POSTGRES_PASSWORD=portfolio_secret
POSTGRES_DB=portfolio
PGADMIN_EMAIL=admin@portfolio.com
PGADMIN_PASSWORD=admin
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173
```

### Backend `.env`
```env
DATABASE_URL=postgresql://portfolio:portfolio_secret@localhost:5432/portfolio
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd app
npm install
npm run dev
```

### Database Commands
```bash
# Generate migrations
cd backend
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate

# Open Drizzle Studio
npx drizzle-kit studio

# Seed database
npm run db:seed
```

## 🚀 Deployment

### Build for Production
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../app
npm run build
```

### Docker Deployment
```bash
docker-compose -f docker-compose.yml up -d
```

## 📄 License

MIT License - feel free to use this template for your own portfolio!
