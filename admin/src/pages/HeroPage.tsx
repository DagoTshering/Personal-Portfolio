import { useEffect, useState } from 'react';
import { heroApi } from '../lib/api';
import type { Hero } from '../types/api';
import { arrayToText, textToArray } from '../lib/format';
import ImageUploader from '../components/ImageUploader';
import AutoTextarea from '../components/AutoTextarea';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { validateWithSchema, type FieldErrors } from '../lib/validation';
import FieldError from '../components/FieldError';

type HeroPayload = Omit<Hero, 'id'>;

const defaultHero: HeroPayload = {
  name: '',
  title: '',
  tagline: '',
  roles: [],
  ctaPrimary: 'Get in Touch',
  ctaPrimaryTarget: '#contact',
  ctaSecondary: 'View Projects',
  ctaSecondaryTarget: '#projects',
  resumeUrl: '',
  avatarUrl: '',
  isVisible: true,
};

const heroSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  title: z.string().trim().min(2, 'Title is required'),
  tagline: z.string().trim().min(8, 'Tagline is too short'),
  ctaPrimary: z.string().trim().min(2, 'Primary CTA is required'),
  ctaPrimaryTarget: z.string().trim().min(2, 'Primary target is required'),
  ctaSecondary: z.string().trim().min(2, 'Secondary CTA is required'),
  ctaSecondaryTarget: z.string().trim().min(2, 'Secondary target is required'),
});

export default function HeroPage() {
  const [form, setForm] = useState<HeroPayload>(defaultHero);
  const [rolesText, setRolesText] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    heroApi.get().then((response) => {
      const data = response.data.data;
      if (data) {
        setForm({ ...data, resumeUrl: data.resumeUrl || '', avatarUrl: data.avatarUrl || '' });
        setRolesText(arrayToText(data.roles));
      }
    }).catch(() => {
      setMessage('Failed to load hero');
      toast.error('Failed to load hero');
    });
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      roles: textToArray(rolesText),
      resumeUrl: form.resumeUrl || null,
      avatarUrl: form.avatarUrl || null,
    };

    const validation = validateWithSchema(heroSchema, payload);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    try {
      await heroApi.update(payload);
      setMessage('Hero updated');
      toast.success('Hero updated');
    } catch {
      setMessage('Failed to save hero');
      toast.error('Failed to save hero');
    }
  };

  return (
    <form onSubmit={handleSave} className="grid-form">
      <h2>Hero</h2>
      <input className={fieldErrors.name ? 'invalid' : ''} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" required />
      <FieldError message={fieldErrors.name} />
      <input className={fieldErrors.title ? 'invalid' : ''} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" required />
      <FieldError message={fieldErrors.title} />
      <AutoTextarea className={fieldErrors.tagline ? 'invalid' : ''} value={form.tagline} onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))} placeholder="Tagline" required />
      <FieldError message={fieldErrors.tagline} />
      <AutoTextarea value={rolesText} onChange={(e) => setRolesText(e.target.value)} placeholder="Roles (one per line)" />
      <input className={fieldErrors.ctaPrimary ? 'invalid' : ''} value={form.ctaPrimary} onChange={(e) => setForm((p) => ({ ...p, ctaPrimary: e.target.value }))} placeholder="Primary CTA" required />
      <FieldError message={fieldErrors.ctaPrimary} />
      <input className={fieldErrors.ctaPrimaryTarget ? 'invalid' : ''} value={form.ctaPrimaryTarget} onChange={(e) => setForm((p) => ({ ...p, ctaPrimaryTarget: e.target.value }))} placeholder="Primary Target" required />
      <FieldError message={fieldErrors.ctaPrimaryTarget} />
      <input className={fieldErrors.ctaSecondary ? 'invalid' : ''} value={form.ctaSecondary} onChange={(e) => setForm((p) => ({ ...p, ctaSecondary: e.target.value }))} placeholder="Secondary CTA" required />
      <FieldError message={fieldErrors.ctaSecondary} />
      <input className={fieldErrors.ctaSecondaryTarget ? 'invalid' : ''} value={form.ctaSecondaryTarget} onChange={(e) => setForm((p) => ({ ...p, ctaSecondaryTarget: e.target.value }))} placeholder="Secondary Target" required />
      <FieldError message={fieldErrors.ctaSecondaryTarget} />
      <input value={form.resumeUrl || ''} onChange={(e) => setForm((p) => ({ ...p, resumeUrl: e.target.value }))} placeholder="Resume URL" />
      <label className="check"><input type="checkbox" checked={form.isVisible} onChange={(e) => setForm((p) => ({ ...p, isVisible: e.target.checked }))} /> Visible</label>
      <ImageUploader label="Avatar" value={form.avatarUrl || ''} onChange={(url) => setForm((p) => ({ ...p, avatarUrl: url }))} />
      <button type="submit">Save Hero</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
