import { Router, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { db } from '../db/index.js';
import { adminUsers } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';

const router = Router();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is required');
}

const isProduction = process.env.NODE_ENV === 'production';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Try again later.',
  },
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().trim().min(2).max(100).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

const signToken = (user: { id: number; email: string; name: string | null }) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    jwtSecret,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'] }
  );
};

const setAuthCookie = (res: Response, token: string) => {
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password format',
      });
    }

    const { email, password } = parsed.data;

    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email));

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const user = users[0];

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is disabled',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    await db
      .update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, user.id));

    const token = signToken(user);
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const users = await db
      .select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name, isActive: adminUsers.isActive })
      .from(adminUsers)
      .where(eq(adminUsers.id, userId));

    if (users.length === 0 || !users[0].isActive) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: users[0].id,
          email: users[0].email,
          name: users[0].name,
        },
      },
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax',
    path: '/',
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration payload',
      });
    }

    const { email, password, name } = parsed.data;

    const admins = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
    if (admins.length > 0) {
      return res.status(403).json({
        success: false,
        message: 'Registration is disabled',
      });
    }

    const existingUsers = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email));

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db
      .insert(adminUsers)
      .values({
        email,
        password: hashedPassword,
        name,
        isActive: true,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: result[0].id,
        email: result[0].email,
        name: result[0].name,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password payload',
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { currentPassword, newPassword } = parsed.data;

    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, userId));

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(adminUsers)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(adminUsers.id, userId));

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;