import { useEffect, useState } from 'react';
import { testimonialsApi } from '../lib/api';
import type { Testimonial } from '../types/api';
import ImageUploader from '../components/ImageUploader';
import AutoTextarea from '../components/AutoTextarea';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { validateWithSchema, type FieldErrors } from '../lib/validation';
import FieldError from '../components/FieldError';
import { swapByIndex } from '../lib/reorder';
import useConfirmDialog from '../hooks/useConfirmDialog';

type Payload = Omit<Testimonial, 'id'>;

const defaults: Payload = {
  name: '',
  role: '',
  company: '',
  avatar: '',
  quote: '',
  rating: 5,
  order: 0,
};

const testimonialSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  role: z.string().trim().min(2, 'Role is required'),
  company: z.string().trim().min(2, 'Company is required'),
  quote: z.string().trim().min(10, 'Quote is too short'),
  rating: z.number().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  order: z.number().min(0, 'Order must be non-negative'),
});

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Payload>(defaults);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { confirm, dialog } = useConfirmDialog();

  const load = async () => {
    const response = await testimonialsApi.list();
    setItems(response.data.data || []);
  };

  useEffect(() => {
    load().catch(() => toast.error('Failed to load testimonials'));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload: Payload = { ...form, avatar: form.avatar || null };

    const validation = validateWithSchema(testimonialSchema, payload);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    const previous = items;
    try {
      if (editingId) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        await testimonialsApi.update(editingId, payload);
        toast.success('Testimonial updated');
      } else {
        const tempId = Date.now() * -1;
        setItems((prev) => [...prev, { ...payload, id: tempId }]);
        await testimonialsApi.create(payload);
        toast.success('Testimonial created');
      }
      setForm(defaults);
      setEditingId(null);
      await load();
    } catch {
      setItems(previous);
      toast.error('Failed to save testimonial');
    }
  };

  const remove = async (id: number) => {
    const approved = await confirm({
      title: 'Delete Testimonial',
      description: 'This testimonial will be removed from the site.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!approved) {
      return;
    }

    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await testimonialsApi.remove(id);
      toast.success('Testimonial deleted');
    } catch {
      setItems(previous);
      toast.error('Failed to delete testimonial');
    }
  };

  const reorder = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const current = items[index];
    const target = items[targetIndex];
    const optimistic = swapByIndex(items, index, targetIndex).map((item, idx) => ({ ...item, order: idx }));
    setItems(optimistic);

    try {
      await Promise.all([
        testimonialsApi.update(current.id, { ...current, order: targetIndex }),
        testimonialsApi.update(target.id, { ...target, order: index }),
      ]);
      toast.success('Order updated');
    } catch {
      await load();
      toast.error('Failed to reorder testimonials');
    }
  };

  return (
    <div>
      <h2>Testimonials</h2>
      <form onSubmit={save} className="grid-form">
        <input className={fieldErrors.name ? 'invalid' : ''} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" required />
        <FieldError message={fieldErrors.name} />
        <input className={fieldErrors.role ? 'invalid' : ''} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="Role" required />
        <FieldError message={fieldErrors.role} />
        <input className={fieldErrors.company ? 'invalid' : ''} value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company" required />
        <FieldError message={fieldErrors.company} />
        <AutoTextarea className={fieldErrors.quote ? 'invalid' : ''} value={form.quote} onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))} placeholder="Quote" required />
        <FieldError message={fieldErrors.quote} />
        <input className={fieldErrors.rating ? 'invalid' : ''} type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))} />
        <FieldError message={fieldErrors.rating} />
        <input className={fieldErrors.order ? 'invalid' : ''} type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} />
        <FieldError message={fieldErrors.order} />
        <ImageUploader label="Avatar" value={form.avatar || ''} onChange={(url) => setForm((p) => ({ ...p, avatar: url }))} />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
      <div className="table-wrapper"><table><thead><tr><th>Name</th><th>Company</th><th>Rating</th><th>Actions</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id}><td>{item.name}</td><td>{item.company}</td><td>{item.rating}</td><td className="row"><button className="muted" onClick={() => reorder(index, -1)}>Up</button><button className="muted" onClick={() => reorder(index, 1)}>Down</button><button className="muted" onClick={() => { setEditingId(item.id); setForm({ ...item, avatar: item.avatar || '' }); }}>Edit</button><button className="danger" onClick={() => remove(item.id)}>Delete</button></td></tr>)}</tbody></table></div>
      {dialog}
    </div>
  );
}
