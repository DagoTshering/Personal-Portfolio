import { Router } from 'express';
import { db } from '../db/index.js';
import { hero } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await db.select().from(hero).limit(1);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hero data not found',
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
      name,
      title,
      tagline,
      roles,
      ctaPrimary,
      ctaPrimaryTarget,
      ctaSecondary,
      ctaSecondaryTarget,
      resumeUrl,
      avatarUrl,
      isVisible,
    } = req.body;

    const existingHero = await db.select().from(hero).limit(1);

    if (existingHero.length === 0) {
      const result = await db.insert(hero).values({
        name,
        title,
        tagline,
        roles: roles || [],
        ctaPrimary,
        ctaPrimaryTarget,
        ctaSecondary,
        ctaSecondaryTarget,
        resumeUrl,
        avatarUrl,
        isVisible: isVisible ?? true,
      }).returning();

      return res.json({
        success: true,
        data: result[0],
        message: 'Hero created successfully',
      });
    }

    const result = await db
      .update(hero)
      .set({
        name,
        title,
        tagline,
        roles: roles || existingHero[0].roles,
        ctaPrimary,
        ctaPrimaryTarget,
        ctaSecondary,
        ctaSecondaryTarget,
        resumeUrl,
        avatarUrl,
        isVisible,
        updatedAt: new Date(),
      })
      .where(eq(hero.id, existingHero[0].id))
      .returning();

    res.json({
      success: true,
      data: result[0],
      message: 'Hero updated successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;