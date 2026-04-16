import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Cloudinary credentials are not fully configured');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export interface UploadResult {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface DeleteResult {
  publicId: string;
  status: 'ok' | 'not found' | 'failed';
}

export const extractPublicIdFromUrl = (imageUrl: string): string | null => {
  try {
    const parsedUrl = new URL(imageUrl);
    const uploadIndex = parsedUrl.pathname.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    let pathAfterUpload = parsedUrl.pathname.slice(uploadIndex + '/upload/'.length);
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');

    const withoutExt = pathAfterUpload.replace(/\.[a-zA-Z0-9]+$/, '');
    return withoutExt || null;
  } catch {
    return null;
  }
};

export const uploadImageBuffer = async (
  fileBuffer: Buffer,
  folder = 'portfolio/admin'
): Promise<UploadResult> => {
  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, uploadResult) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(uploadResult);
      }
    );

    stream.end(fileBuffer);
  });

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
};

export const deleteImageAsset = async (params: {
  publicId?: string;
  url?: string;
}): Promise<DeleteResult> => {
  const publicId = params.publicId || (params.url ? extractPublicIdFromUrl(params.url) : null);

  if (!publicId) {
    throw new Error('A valid publicId or Cloudinary URL is required');
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
  });

  const status =
    result.result === 'ok'
      ? 'ok'
      : result.result === 'not found'
      ? 'not found'
      : 'failed';

  return {
    publicId,
    status,
  };
};
