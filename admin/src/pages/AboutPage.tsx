import { useEffect, useState } from 'react';
import { aboutApi } from '../lib/api';
import type { About } from '../types/api';
import { arrayToText, textToArray } from '../lib/format';
import ImageUploader from '../components/ImageUploader';
import AutoTextarea from '../components/AutoTextarea';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { validateWithSchema, type FieldErrors } from '../lib/validation';
import FieldError from '../components/FieldError';

type AboutPayload = Omit<About, 'id'>;

const defaultAbout: AboutPayload = {
  bio: '',
  yearsExperience: 0,
  location: '',
  availability: '',
  funFacts: [],
  profileImageUrl: '',
  stats: [],
};

const aboutSchema = z.object({
  bio: z.string().trim().min(20, 'Bio is too short'),
  yearsExperience: z.number().min(0, 'Years cannot be negative'),
  location: z.string().trim().min(2, 'Location is required'),
  availability: z.string().trim().min(2, 'Availability is required'),
});

export default function AboutPage() {
  const [form, setForm] = useState<AboutPayload>(defaultAbout);
  const [factsText, setFactsText] = useState('');
  const [statsText, setStatsText] = useState('[]');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    aboutApi.get().then((response) => {
      const data = response.data.data;
      if (data) {
        setForm({ ...data, profileImageUrl: data.profileImageUrl || '' });
        setFactsText(arrayToText(data.funFacts));
        setStatsText(JSON.stringify(data.stats || [], null, 2));
      }
    }).catch(() => {
      setMessage('Failed to load about');
      toast.error('Failed to load about');
    });
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const parsedStats = JSON.parse(statsText);
      const payload = {
        ...form,
        profileImageUrl: form.profileImageUrl || null,
        funFacts: textToArray(factsText),
        stats: parsedStats,
      };

      const validation = validateWithSchema(aboutSchema, payload);
      if (!validation.ok) {
        setFieldErrors(validation.errors);
        return;
      }

      setFieldErrors({});
      await aboutApi.update(payload);
      setMessage('About updated');
      toast.success('About updated');
    } catch {
      setFieldErrors((prev) => ({ ...prev, stats: 'Stats must be valid JSON' }));
      setMessage('Invalid data or save failed');
      toast.error('Invalid data or save failed');
    }
  };

  return (
    <form onSubmit={save} className="grid-form">
      <h2>About</h2>
      <AutoTextarea className={fieldErrors.bio ? 'invalid' : ''} value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Bio" required />
      <FieldError message={fieldErrors.bio} />
      <input className={fieldErrors.yearsExperience ? 'invalid' : ''} type="number" value={form.yearsExperience} onChange={(e) => setForm((p) => ({ ...p, yearsExperience: Number(e.target.value) }))} placeholder="Years Experience" required />
      <FieldError message={fieldErrors.yearsExperience} />
      <input className={fieldErrors.location ? 'invalid' : ''} value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" required />
      <FieldError message={fieldErrors.location} />
      <input className={fieldErrors.availability ? 'invalid' : ''} value={form.availability} onChange={(e) => setForm((p) => ({ ...p, availability: e.target.value }))} placeholder="Availability" required />
      <FieldError message={fieldErrors.availability} />
      <AutoTextarea value={factsText} onChange={(e) => setFactsText(e.target.value)} placeholder="Fun facts (one per line)" />
      <AutoTextarea value={statsText} onChange={(e) => setStatsText(e.target.value)} placeholder="Stats JSON" />
      <FieldError message={fieldErrors.stats} />
      <ImageUploader label="Profile Image" value={form.profileImageUrl || ''} onChange={(url) => setForm((p) => ({ ...p, profileImageUrl: url }))} />
      <button type="submit">Save About</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
