import { Router } from 'express';
import { db } from '../db/index.js';
import { services } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, asc } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await db
      .select()
      .from(services)
      .orderBy(asc(services.order));

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
      .from(services)
      .where(eq(services.id, parseInt(req.params.id)));

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
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
    const { title, description, icon, features, highlighted, order } = req.body;

    const result = await db
      .insert(services)
      .values({
        title,
        description,
        icon,
        features: features || [],
        highlighted: highlighted || false,
        order: order || 0,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: result[0],
      message: 'Service created successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { title, description, icon, features, highlighted, order } = req.body;

    const result = await db
      .update(services)
      .set({
        title,
        description,
        icon,
        features,
        highlighted,
        order,
        updatedAt: new Date(),
      })
      .where(eq(services.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
      message: 'Service updated successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await db
      .delete(services)
      .where(eq(services.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;