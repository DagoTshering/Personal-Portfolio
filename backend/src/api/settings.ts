import { Router } from 'express';
import { db } from '../db/index.js';
import { siteSettings } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await db.select().from(siteSettings).limit(1);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found',
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
      siteName,
      siteTitle,
      siteDescription,
      email,
      phone,
      location,
      availability,
      ogImage,
      favicon,
    } = req.body;

    const existingSettings = await db.select().from(siteSettings).limit(1);

    if (existingSettings.length === 0) {
      const result = await db
        .insert(siteSettings)
        .values({
          siteName,
          siteTitle,
          siteDescription,
          email,
          phone,
          location,
          availability,
          ogImage,
          favicon,
        })
        .returning();

      return res.json({
        success: true,
        data: result[0],
        message: 'Settings created successfully',
      });
    }

    const result = await db
      .update(siteSettings)
      .set({
        siteName,
        siteTitle,
        siteDescription,
        email,
        phone,
        location,
        availability,
        ogImage,
        favicon,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, existingSettings[0].id))
      .returning();

    res.json({
      success: true,
      data: result[0],
      message: 'Settings updated successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;