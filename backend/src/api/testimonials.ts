import { Router } from 'express';
import { db } from '../db/index.js';
import { testimonials } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, asc } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.order));

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
      .from(testimonials)
      .where(eq(testimonials.id, parseInt(req.params.id)));

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
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
    const { name, role, company, avatar, quote, rating, order } = req.body;

    const result = await db
      .insert(testimonials)
      .values({
        name,
        role,
        company,
        avatar,
        quote,
        rating: rating || 5,
        order: order || 0,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: result[0],
      message: 'Testimonial created successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { name, role, company, avatar, quote, rating, order } = req.body;

    const result = await db
      .update(testimonials)
      .set({
        name,
        role,
        company,
        avatar,
        quote,
        rating,
        order,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
      message: 'Testimonial updated successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;