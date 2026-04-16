import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  integer, 
  boolean, 
  timestamp, 
  jsonb,
  pgEnum 
} from 'drizzle-orm/pg-core';

// Enums
export const skillCategoryEnum = pgEnum('skill_category', [
  'frontend', 
  'backend', 
  'database', 
  'devops', 
  'tools'
]);

export const projectCategoryEnum = pgEnum('project_category', [
  'web', 
  'api', 
  'mobile', 
  'oss'
]);

export const employmentTypeEnum = pgEnum('employment_type', [
  'fulltime', 
  'contract', 
  'freelance'
]);

// Hero Table
export const hero = pgTable('hero', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  tagline: text('tagline').notNull(),
  roles: jsonb('roles').$type<string[]>().notNull().default([]),
  ctaPrimary: varchar('cta_primary', { length: 100 }).notNull().default('Get in Touch'),
  ctaPrimaryTarget: varchar('cta_primary_target', { length: 100 }).notNull().default('#contact'),
  ctaSecondary: varchar('cta_secondary', { length: 100 }).notNull().default('View Projects'),
  ctaSecondaryTarget: varchar('cta_secondary_target', { length: 100 }).notNull().default('#projects'),
  resumeUrl: varchar('resume_url', { length: 500 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// About Table
export const about = pgTable('about', {
  id: serial('id').primaryKey(),
  bio: text('bio').notNull(),
  yearsExperience: integer('years_experience').notNull().default(0),
  location: varchar('location', { length: 255 }).notNull(),
  availability: varchar('availability', { length: 255 }).notNull().default('Available for freelance'),
  funFacts: jsonb('fun_facts').$type<string[]>().notNull().default([]),
  profileImageUrl: varchar('profile_image_url', { length: 500 }),
  stats: jsonb('stats').$type<{ label: string; value: number; suffix?: string }[]>().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Skills Table
export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  category: skillCategoryEnum('category').notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  proficiency: integer('proficiency').notNull().default(3),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Projects Table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  thumbnail: varchar('thumbnail', { length: 500 }).notNull(),
  images: jsonb('images').$type<string[]>().notNull().default([]),
  techStack: jsonb('tech_stack').$type<string[]>().notNull().default([]),
  category: projectCategoryEnum('category').notNull(),
  featured: boolean('featured').notNull().default(false),
  order: integer('order').notNull().default(0),
  liveUrl: varchar('live_url', { length: 500 }),
  githubUrl: varchar('github_url', { length: 500 }),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Experience Table
export const experience = pgTable('experience', {
  id: serial('id').primaryKey(),
  company: varchar('company', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  startDate: varchar('start_date', { length: 50 }).notNull(),
  endDate: varchar('end_date', { length: 50 }),
  current: boolean('current').notNull().default(false),
  description: jsonb('description').$type<string[]>().notNull().default([]),
  location: varchar('location', { length: 255 }).notNull(),
  type: employmentTypeEnum('type').notNull().default('fulltime'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Testimonials Table
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 500 }),
  quote: text('quote').notNull(),
  rating: integer('rating').notNull().default(5),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Blog Posts Table
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImage: varchar('cover_image', { length: 500 }),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  publishedAt: varchar('published_at', { length: 50 }),
  readTime: integer('read_time').notNull().default(5),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Services Table
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  features: jsonb('features').$type<string[]>().notNull().default([]),
  highlighted: boolean('highlighted').notNull().default(false),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Social Links Table
export const socialLinks = pgTable('social_links', {
  id: serial('id').primaryKey(),
  platform: varchar('platform', { length: 100 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Contact Messages Table
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Site Settings Table
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  siteName: varchar('site_name', { length: 255 }).notNull().default('Developer Portfolio'),
  siteTitle: varchar('site_title', { length: 255 }).notNull().default('Fullstack Developer Portfolio'),
  siteDescription: text('site_description').notNull().default('Fullstack developer specializing in modern web technologies'),
  email: varchar('email', { length: 255 }).notNull().default('hello@example.com'),
  phone: varchar('phone', { length: 50 }),
  location: varchar('location', { length: 255 }),
  availability: varchar('availability', { length: 255 }),
  ogImage: varchar('og_image', { length: 500 }),
  favicon: varchar('favicon', { length: 500 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Admin Users Table
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  isActive: boolean('is_active').notNull().default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Types
export type Hero = typeof hero.$inferSelect;
export type NewHero = typeof hero.$inferInsert;

export type About = typeof about.$inferSelect;
export type NewAbout = typeof about.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Experience = typeof experience.$inferSelect;
export type NewExperience = typeof experience.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type SocialLink = typeof socialLinks.$inferSelect;
export type NewSocialLink = typeof socialLinks.$inferInsert;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
