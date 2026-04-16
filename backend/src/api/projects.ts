import { Router } from 'express';
import { db } from '../db/index.js';
import { projects } from '../db/schema.js';
import { authenticateToken } from '../middleware/auth.js';
import { eq, asc, and } from 'drizzle-orm';

const router = Router();

// GET /api/projects - Get all projects (public)
router.get('/', async (req, res, next) => {
  try {
    const { featured, category, published } = req.query;

    let query = db.select().from(projects);

    const conditions = [];
    if (featured === 'true') {
      conditions.push(eq(projects.featured, true));
    }
    if (category) {
      conditions.push(eq(projects.category, category as 'web' | 'api' | 'mobile' | 'oss'));
    }
    if (published === 'true') {
      conditions.push(eq(projects.published, true));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const result = await query.orderBy(asc(projects.order));

    res.json({
      success: true,
      data: result,
    });
    return;
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:slug - Get single project by slug (public)
router.get('/:slug', async (req, res, next) => {
  try {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, req.params.slug));

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
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

// POST /api/projects - Create project (protected)
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      longDescription,
      thumbnail,
      images,
      techStack,
      category,
      featured,
      order,
      liveUrl,
      githubUrl,
      published,
    } = req.body;

    const result = await db
      .insert(projects)
      .values({
        title,
        slug,
        description,
        longDescription,
        thumbnail,
        images: images || [],
        techStack: techStack || [],
        category,
        featured: featured || false,
        order: order || 0,
        liveUrl,
        githubUrl,
        published: published ?? true,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: result[0],
      message: 'Project created successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id - Update project (protected)
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      longDescription,
      thumbnail,
      images,
      techStack,
      category,
      featured,
      order,
      liveUrl,
      githubUrl,
      published,
    } = req.body;

    const result = await db
      .update(projects)
      .set({
        title,
        slug,
        description,
        longDescription,
        thumbnail,
        images,
        techStack,
        category,
        featured,
        order,
        liveUrl,
        githubUrl,
        published,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
      message: 'Project updated successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Delete project (protected)
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, parseInt(req.params.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;