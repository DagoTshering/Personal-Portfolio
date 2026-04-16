export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
}

export interface DashboardStats {
  skills: number;
  projects: number;
  experience: number;
  testimonials: number;
  blogPosts: number;
  services: number;
  messages: number;
  unreadMessages: number;
}

export interface Skill {
  id: number;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
  icon: string;
  proficiency: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Hero {
  id: number;
  name: string;
  title: string;
  tagline: string;
  roles: string[];
  ctaPrimary: string;
  ctaPrimaryTarget: string;
  ctaSecondary: string;
  ctaSecondaryTarget: string;
  resumeUrl: string | null;
  avatarUrl: string | null;
  isVisible: boolean;
}

export interface About {
  id: number;
  bio: string;
  yearsExperience: number;
  location: string;
  availability: string;
  funFacts: string[];
  profileImageUrl: string | null;
  stats: Array<{ label: string; value: number; suffix?: string }>;
}

export interface SiteSetting {
  id: number;
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  email: string;
  phone: string | null;
  location: string | null;
  availability: string | null;
  ogImage: string | null;
  favicon: string | null;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription: string | null;
  thumbnail: string;
  images: string[];
  techStack: string[];
  category: 'web' | 'api' | 'mobile' | 'oss';
  featured: boolean;
  order: number;
  liveUrl: string | null;
  githubUrl: string | null;
  published: boolean;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string[];
  location: string;
  type: 'fulltime' | 'contract' | 'freelance';
  order: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  highlighted: boolean;
  order: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string | null;
  quote: string;
  rating: number;
  order: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  publishedAt: string | null;
  readTime: number;
  published: boolean;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
