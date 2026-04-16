import { Router } from 'express';
import { db } from '../db/index.js';
import { 
  hero, 
  about, 
  skills, 
  projects, 
  experience, 
  testimonials, 
  blogPosts, 
  services, 
  socialLinks, 
  contactMessages,
  siteSettings 
} from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { sql } from 'drizzle-orm';

const router = Router();

router.get('/dashboard', authenticateToken, async (_req, res, next) => {
  try {
    const [
      skillsCount,
      projectsCount,
      experienceCount,
      testimonialsCount,
      blogPostsCount,
      servicesCount,
      messagesCount,
      unreadMessagesCount,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(skills),
      db.select({ count: sql<number>`count(*)` }).from(projects),
      db.select({ count: sql<number>`count(*)` }).from(experience),
      db.select({ count: sql<number>`count(*)` }).from(testimonials),
      db.select({ count: sql<number>`count(*)` }).from(blogPosts),
      db.select({ count: sql<number>`count(*)` }).from(services),
      db.select({ count: sql<number>`count(*)` }).from(contactMessages),
      db.select({ count: sql<number>`count(*)` }).from(contactMessages).where(sql`read = false`),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          skills: skillsCount[0].count,
          projects: projectsCount[0].count,
          experience: experienceCount[0].count,
          testimonials: testimonialsCount[0].count,
          blogPosts: blogPostsCount[0].count,
          services: servicesCount[0].count,
          messages: messagesCount[0].count,
          unreadMessages: unreadMessagesCount[0].count,
        },
      },
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.get('/content', authenticateToken, async (_req, res, next) => {
  try {
    const [
      heroData,
      aboutData,
      skillsData,
      projectsData,
      experienceData,
      testimonialsData,
      blogPostsData,
      servicesData,
      socialLinksData,
      settingsData,
    ] = await Promise.all([
      db.select().from(hero).limit(1),
      db.select().from(about).limit(1),
      db.select().from(skills),
      db.select().from(projects),
      db.select().from(experience),
      db.select().from(testimonials),
      db.select().from(blogPosts),
      db.select().from(services),
      db.select().from(socialLinks),
      db.select().from(siteSettings).limit(1),
    ]);

    res.json({
      success: true,
      data: {
        hero: heroData[0] || null,
        about: aboutData[0] || null,
        skills: skillsData,
        projects: projectsData,
        experience: experienceData,
        testimonials: testimonialsData,
        blogPosts: blogPostsData,
        services: servicesData,
        socialLinks: socialLinksData,
        settings: settingsData[0] || null,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;