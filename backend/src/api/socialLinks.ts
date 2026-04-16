import { Router } from 'express';
import { db } from '../db/index.js';
import { socialLinks } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, asc } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await db
      .select()
      .from(socialLinks)
      .orderBy(asc(socialLinks.order));

    res.json({
      success: true,
      data: result,
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { platform, url, icon, order } = req.body;

    const result = await db
      .insert(socialLinks)
      .values({
        platform,
        url,
        icon,
        order: order || 0,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: result[0],
      message: 'Social link created successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { platform, url, icon, order } = req.body;

    const result = await db
      .update(socialLinks)
      .set({
        platform,
        url,
        icon,
        order,
        updatedAt: new Date(),
      })
      .where(eq(socialLinks.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
      message: 'Social link updated successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await db
      .delete(socialLinks)
      .where(eq(socialLinks.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found',
      });
    }

    res.json({
      success: true,
      message: 'Social link deleted successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;