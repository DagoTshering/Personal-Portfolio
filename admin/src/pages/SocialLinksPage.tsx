import { useEffect, useState } from 'react';
import { socialLinksApi } from '../lib/api';
import type { SocialLink } from '../types/api';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { validateWithSchema, type FieldErrors } from '../lib/validation';
import FieldError from '../components/FieldError';
import { swapByIndex } from '../lib/reorder';
import useConfirmDialog from '../hooks/useConfirmDialog';

type Payload = Omit<SocialLink, 'id'>;

const defaults: Payload = { platform: '', url: '', icon: '', order: 0 };

const socialLinkSchema = z.object({
  platform: z.string().trim().min(2, 'Platform is required'),
  url: z.string().url('URL must be valid'),
  icon: z.string().trim().min(1, 'Icon is required'),
  order: z.number().min(0, 'Order must be non-negative'),
});

export default function SocialLinksPage() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [form, setForm] = useState<Payload>(defaults);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { confirm, dialog } = useConfirmDialog();

  const load = async () => {
    const response = await socialLinksApi.list();
    setItems(response.data.data || []);
  };

  useEffect(() => {
    load().catch(() => toast.error('Failed to load social links'));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();

    const validation = validateWithSchema(socialLinkSchema, form);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    const previous = items;

    try {
      if (editingId) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...form } : item)));
        await socialLinksApi.update(editingId, form);
        toast.success('Social link updated');
      } else {
        const tempId = Date.now() * -1;
        setItems((prev) => [...prev, { ...form, id: tempId }]);
        await socialLinksApi.create(form);
        toast.success('Social link created');
      }
      setEditingId(null);
      setForm(defaults);
      await load();
    } catch {
      setItems(previous);
      toast.error('Failed to save social link');
    }
  };

  const remove = async (id: number) => {
    const approved = await confirm({
      title: 'Delete Social Link',
      description: 'This social link will be removed from the profile.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!approved) {
      return;
    }

    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await socialLinksApi.remove(id);
      toast.success('Social link deleted');
    } catch {
      setItems(previous);
      toast.error('Failed to delete social link');
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
        socialLinksApi.update(current.id, { ...current, order: targetIndex }),
        socialLinksApi.update(target.id, { ...target, order: index }),
      ]);
      toast.success('Order updated');
    } catch {
      await load();
      toast.error('Failed to reorder social links');
    }
  };

  return (
    <div>
      <h2>Social Links</h2>
      <form onSubmit={save} className="grid-form">
        <input className={fieldErrors.platform ? 'invalid' : ''} value={form.platform} onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))} placeholder="Platform" required />
        <FieldError message={fieldErrors.platform} />
        <input className={fieldErrors.url ? 'invalid' : ''} value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="URL" required />
        <FieldError message={fieldErrors.url} />
        <input className={fieldErrors.icon ? 'invalid' : ''} value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="Icon" required />
        <FieldError message={fieldErrors.icon} />
        <input className={fieldErrors.order ? 'invalid' : ''} type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} />
        <FieldError message={fieldErrors.order} />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
      <div className="table-wrapper"><table><thead><tr><th>Platform</th><th>URL</th><th>Actions</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id}><td>{item.platform}</td><td>{item.url}</td><td className="row"><button className="muted" onClick={() => reorder(index, -1)}>Up</button><button className="muted" onClick={() => reorder(index, 1)}>Down</button><button className="muted" onClick={() => { setEditingId(item.id); setForm(item); }}>Edit</button><button className="danger" onClick={() => remove(item.id)}>Delete</button></td></tr>)}</tbody></table></div>
      {dialog}
    </div>
  );
}
