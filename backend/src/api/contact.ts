import { Router } from 'express';
import { db } from '../db/index.js';
import { contactMessages } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, desc } from 'drizzle-orm';
import { sendContactEmail } from '../services/email.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    const result = await db
      .insert(contactMessages)
      .values({
        name,
        email,
        subject,
        message,
        read: false,
      })
      .returning();

    try {
      await sendContactEmail({ name, email, subject, message });
      console.log('Contact email sent successfully to admin');
    } catch (err) {
      console.error('Failed to send contact email:', err);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.',
      data: { id: result[0].id },
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticateToken, async (_req, res, next) => {
  try {
    const result = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));

    res.json({
      success: true,
      data: result,
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.put('/:id/read', authenticateToken, async (req, res, next) => {
  try {
    const result = await db
      .update(contactMessages)
      .set({ read: true, updatedAt: new Date() })
      .where(eq(contactMessages.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message marked as read',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;