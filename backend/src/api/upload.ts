import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import { deleteImageAsset, uploadImageBuffer } from '../services/cloudinary.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});

router.post('/image', authenticateToken, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required',
      });
    }

    const result = await uploadImageBuffer(req.file.buffer);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Image uploaded successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

router.delete('/image', authenticateToken, async (req, res, next) => {
  try {
    const { publicId, url } = req.body || {};

    const result = await deleteImageAsset({
      publicId,
      url,
    });

    if (result.status === 'failed') {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete image from Cloudinary',
      });
    }

    res.json({
      success: true,
      data: result,
      message:
        result.status === 'not found'
          ? 'Image was already removed from Cloudinary'
          : 'Image deleted successfully',
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;
