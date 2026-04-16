import { Router } from 'express';
import { db } from '../db/index.js';
import { skills } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, asc } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await db
      .select()
      .from(skills)
      .orderBy(asc(skills.order));

    res.json({
      success: true,
      data: result,
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await db
      .select()
      .from(skills)
      .where(eq(skills.id, parseInt(req.params.id)));

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
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

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name, category, icon, proficiency, order } = req.body;

    const result = await db
      .insert(skills)
      .values({
        name,
        category,
        icon,
        proficiency,
        order: order || 0,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: result[0],
      message: 'Skill created successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { name, category, icon, proficiency, order } = req.body;

    const result = await db
      .update(skills)
      .set({
        name,
        category,
        icon,
        proficiency,
        order,
        updatedAt: new Date(),
      })
      .where(eq(skills.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
      message: 'Skill updated successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await db
      .delete(skills)
      .where(eq(skills.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.json({
      success: true,
      message: 'Skill deleted successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.put('/reorder', authenticateToken, async (req, res, next) => {
  try {
    const { items } = req.body;

    for (const item of items) {
      await db
        .update(skills)
        .set({ order: item.order, updatedAt: new Date() })
        .where(eq(skills.id, item.id));
    }

    res.json({
      success: true,
      message: 'Skills reordered successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;