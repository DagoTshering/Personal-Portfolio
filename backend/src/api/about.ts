import { Router } from 'express';
import { db } from '../db/index.js';
import { about } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await db.select().from(about).limit(1);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'About data not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.put('/', authenticateToken, async (req, res, next) => {
  try {
    const {
      bio,
      yearsExperience,
      location,
      availability,
      funFacts,
      profileImageUrl,
      stats,
    } = req.body;

    const existingAbout = await db.select().from(about).limit(1);

    if (existingAbout.length === 0) {
      const result = await db.insert(about).values({
        bio,
        yearsExperience,
        location,
        availability,
        funFacts: funFacts || [],
        profileImageUrl,
        stats: stats || [],
      }).returning();

      return res.json({
        success: true,
        data: result[0],
        message: 'About created successfully',
      });
    }

    const result = await db
      .update(about)
      .set({
        bio,
        yearsExperience,
        location,
        availability,
        funFacts: funFacts || existingAbout[0].funFacts,
        profileImageUrl,
        stats: stats || existingAbout[0].stats,
        updatedAt: new Date(),
      })
      .where(eq(about.id, existingAbout[0].id))
      .returning();

    res.json({
      success: true,
      data: result[0],
      message: 'About updated successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;