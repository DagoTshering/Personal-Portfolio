import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { settingsApi } from '../lib/api';
import type { SiteSetting } from '../types/api';
import ImageUploader from '../components/ImageUploader';
import AutoTextarea from '../components/AutoTextarea';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { validateWithSchema, type FieldErrors } from '../lib/validation';
import FieldError from '../components/FieldError';
import useConfirmDialog from '../hooks/useConfirmDialog';
import { useAuthStore } from '../store/auth';

type SettingsPayload = Omit<SiteSetting, 'id'>;

const defaults: SettingsPayload = {
  siteName: '',
  siteTitle: '',
  siteDescription: '',
  email: '',
  phone: '',
  location: '',
  availability: '',
  ogImage: '',
  favicon: '',
};

const settingsSchema = z.object({
  siteName: z.string().trim().min(2, 'Site name is required'),
  siteTitle: z.string().trim().min(2, 'Site title is required'),
  siteDescription: z.string().trim().min(10, 'Description is too short'),
  email: z.string().email('Email must be valid'),
});

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { confirm, dialog } = useConfirmDialog();
  const [form, setForm] = useState<SettingsPayload>(defaults);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    settingsApi.get().then((response) => {
      const data = response.data.data;
      if (data) {
        setForm({
          ...data,
          phone: data.phone || '',
          location: data.location || '',
          availability: data.availability || '',
          ogImage: data.ogImage || '',
          favicon: data.favicon || '',
        });
      }
    }).catch(() => {
      setMessage('Failed to load settings');
      toast.error('Failed to load settings');
    });
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      phone: form.phone || null,
      location: form.location || null,
      availability: form.availability || null,
      ogImage: form.ogImage || null,
      favicon: form.favicon || null,
    };

    const validation = validateWithSchema(settingsSchema, payload);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});

    try {
      await settingsApi.update(payload);
      setMessage('Settings updated');
      toast.success('Settings updated');
    } catch {
      setMessage('Failed to save settings');
      toast.error('Failed to save settings');
    }
  };

  const handleLogout = async () => {
    const approved = await confirm({
      title: 'Log Out',
      description: 'Are you sure you want to log out from the admin panel?',
      confirmLabel: 'Log Out',
      cancelLabel: 'Stay',
    });

    if (!approved) {
      return;
    }

    try {
      await logout();
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  return (
    <>
      <form onSubmit={save} className="grid-form">
        <h2>Settings</h2>
        <input className={fieldErrors.siteName ? 'invalid' : ''} value={form.siteName} onChange={(e) => setForm((p) => ({ ...p, siteName: e.target.value }))} placeholder="Site Name" required />
        <FieldError message={fieldErrors.siteName} />
        <input className={fieldErrors.siteTitle ? 'invalid' : ''} value={form.siteTitle} onChange={(e) => setForm((p) => ({ ...p, siteTitle: e.target.value }))} placeholder="Site Title" required />
        <FieldError message={fieldErrors.siteTitle} />
        <AutoTextarea className={fieldErrors.siteDescription ? 'invalid' : ''} value={form.siteDescription} onChange={(e) => setForm((p) => ({ ...p, siteDescription: e.target.value }))} placeholder="Description" required />
        <FieldError message={fieldErrors.siteDescription} />
        <input className={fieldErrors.email ? 'invalid' : ''} type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" required />
        <FieldError message={fieldErrors.email} />
        <input value={form.phone || ''} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" />
        <input value={form.location || ''} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" />
        <input value={form.availability || ''} onChange={(e) => setForm((p) => ({ ...p, availability: e.target.value }))} placeholder="Availability" />
        <ImageUploader label="OG Image" value={form.ogImage || ''} onChange={(url) => setForm((p) => ({ ...p, ogImage: url }))} />
        <ImageUploader label="Favicon" value={form.favicon || ''} onChange={(url) => setForm((p) => ({ ...p, favicon: url }))} />
        <button type="submit">Save Settings</button>
        <button type="button" className="danger settings-logout" onClick={handleLogout}>
          <LogOut size={16} />
          Log Out
        </button>
        {message ? <p>{message}</p> : null}
      </form>
      {dialog}
    </>
  );
}
