import { useState } from 'react';
import { uploadApi } from '../lib/api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const response = await uploadApi.image(file);
      const url = response.data.data?.url;
      const publicId = response.data.data?.publicId;
      if (url) {
        onChange(url);
        setUploadedPublicId(publicId || null);
        toast.success('Image uploaded');
      }
    } catch {
      setError('Upload failed');
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (nextUrl: string) => {
    onChange(nextUrl);
    if (nextUrl !== value) {
      setUploadedPublicId(null);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    setRemoving(true);
    setError(null);
    try {
      await uploadApi.removeImage({
        publicId: uploadedPublicId || undefined,
        url: value,
      });
      onChange('');
      setUploadedPublicId(null);
      setConfirmOpen(false);
      toast.success('Image removed');
    } catch {
      setError('Could not remove image from Cloudinary');
      toast.error('Could not remove image from Cloudinary');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="card">
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => handleUrlChange(e.target.value)} placeholder="Image URL" />
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading || removing} />
      {uploading ? <p>Uploading...</p> : null}
      {removing ? <p>Removing image...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {value ? (
        <div className="preview-wrap">
          <img src={value} alt={label} className="preview" />
          <button
            type="button"
            className="preview-remove"
            onClick={() => setConfirmOpen(true)}
            disabled={removing}
            aria-label="Remove uploaded image"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Uploaded Image"
        description="This will permanently remove the image from Cloudinary and clear the URL field."
        confirmLabel="Delete"
        cancelLabel="Keep"
        loading={removing}
        onConfirm={handleRemove}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
