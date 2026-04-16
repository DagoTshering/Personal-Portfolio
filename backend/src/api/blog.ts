import { Router } from 'express';
import { db } from '../db/index.js';
import { blogPosts } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, desc, and } from 'drizzle-orm';

const router = Router();

// GET /api/blog - Get all blog posts (public)
router.get('/', async (req, res, next) => {
  try {
    const { published, limit = '10', page = '1' } = req.query;

    let query = db.select().from(blogPosts);

    const conditions = [];
    if (published === 'true') {
      conditions.push(eq(blogPosts.published, true));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const result = await query
      .orderBy(desc(blogPosts.publishedAt))
      .limit(parseInt(limit as string))
      .offset((parseInt(page as string) - 1) * parseInt(limit as string));

    res.json({
      success: true,
      data: result,
      meta: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    });
    return;
  } catch (error) {
    next(error);
  }
});

// GET /api/blog/:slug - Get single blog post by slug (public)
router.get('/:slug', async (req, res, next) => {
  try {
    const result = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, req.params.slug));

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
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

// POST /api/blog - Create blog post (protected)
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags,
      publishedAt,
      readTime,
      published,
    } = req.body;

    const result = await db
      .insert(blogPosts)
      .values({
        title,
        slug,
        excerpt,
        content,
        coverImage,
        tags: tags || [],
        publishedAt,
        readTime: readTime || 5,
        published: published || false,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: result[0],
      message: 'Blog post created successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

// PUT /api/blog/:id - Update blog post (protected)
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags,
      publishedAt,
      readTime,
      published,
    } = req.body;

    const result = await db
      .update(blogPosts)
      .set({
        title,
        slug,
        excerpt,
        content,
        coverImage,
        tags,
        publishedAt,
        readTime,
        published,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
      message: 'Blog post updated successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

// DELETE /api/blog/:id - Delete blog post (protected)
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;