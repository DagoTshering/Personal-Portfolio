import { Router } from 'express';
import { db } from '../db/index.js';
import { experience } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, asc } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await db
      .select()
      .from(experience)
      .orderBy(asc(experience.order));

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
      .from(experience)
      .where(eq(experience.id, parseInt(req.params.id)));

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Experience entry not found',
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
    const {
      company,
      role,
      startDate,
      endDate,
      current,
      description,
      location,
      type,
      order,
    } = req.body;

    const result = await db
      .insert(experience)
      .values({
        company,
        role,
        startDate,
        endDate,
        current: current || false,
        description: description || [],
        location,
        type,
        order: order || 0,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: result[0],
      message: 'Experience entry created successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const {
      company,
      role,
      startDate,
      endDate,
      current,
      description,
      location,
      type,
      order,
    } = req.body;

    const result = await db
      .update(experience)
      .set({
        company,
        role,
        startDate,
        endDate,
        current,
        description,
        location,
        type,
        order,
        updatedAt: new Date(),
      })
      .where(eq(experience.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Experience entry not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
      message: 'Experience entry updated successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await db
      .delete(experience)
      .where(eq(experience.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Experience entry not found',
      });
    }

    res.json({
      success: true,
      message: 'Experience entry deleted successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;