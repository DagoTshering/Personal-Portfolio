import { useEffect, useState } from 'react';
import { servicesApi } from '../lib/api';
import type { Service } from '../types/api';
import { arrayToText, textToArray } from '../lib/format';
import AutoTextarea from '../components/AutoTextarea';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { validateWithSchema, type FieldErrors } from '../lib/validation';
import FieldError from '../components/FieldError';
import { swapByIndex } from '../lib/reorder';
import useConfirmDialog from '../hooks/useConfirmDialog';

type Payload = Omit<Service, 'id'>;

const defaults: Payload = {
  title: '',
  description: '',
  icon: 'code',
  features: [],
  highlighted: false,
  order: 0,
};

const serviceSchema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  description: z.string().trim().min(8, 'Description is too short'),
  icon: z.string().trim().min(1, 'Icon is required'),
  order: z.number().min(0, 'Order must be non-negative'),
});

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState<Payload>(defaults);
  const [featuresText, setFeaturesText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { confirm, dialog } = useConfirmDialog();

  const load = async () => {
    const response = await servicesApi.list();
    setItems(response.data.data || []);
  };

  useEffect(() => {
    load().catch(() => toast.error('Failed to load services'));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload: Payload = { ...form, features: textToArray(featuresText) };

    const validation = validateWithSchema(serviceSchema, payload);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    const previous = items;
    try {
      if (editingId) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        await servicesApi.update(editingId, payload);
        toast.success('Service updated');
      } else {
        const tempId = Date.now() * -1;
        setItems((prev) => [...prev, { ...payload, id: tempId }]);
        await servicesApi.create(payload);
        toast.success('Service created');
      }
      setForm(defaults);
      setFeaturesText('');
      setEditingId(null);
      await load();
    } catch {
      setItems(previous);
      toast.error('Failed to save service');
    }
  };

  const edit = (item: Service) => {
    setEditingId(item.id);
    setForm(item);
    setFeaturesText(arrayToText(item.features));
    setFieldErrors({});
  };

  const remove = async (id: number) => {
    const approved = await confirm({
      title: 'Delete Service',
      description: 'This service will be permanently removed.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!approved) {
      return;
    }

    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await servicesApi.remove(id);
      toast.success('Service deleted');
    } catch {
      setItems(previous);
      toast.error('Failed to delete service');
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
        servicesApi.update(current.id, { ...current, order: targetIndex }),
        servicesApi.update(target.id, { ...target, order: index }),
      ]);
      toast.success('Order updated');
    } catch {
      await load();
      toast.error('Failed to reorder services');
    }
  };

  return (
    <div>
      <h2>Services</h2>
      <form onSubmit={save} className="grid-form">
        <input className={fieldErrors.title ? 'invalid' : ''} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" required />
        <FieldError message={fieldErrors.title} />
        <AutoTextarea className={fieldErrors.description ? 'invalid' : ''} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" required />
        <FieldError message={fieldErrors.description} />
        <input className={fieldErrors.icon ? 'invalid' : ''} value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="Icon" required />
        <FieldError message={fieldErrors.icon} />
        <AutoTextarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="Features (one per line)" />
        <input className={fieldErrors.order ? 'invalid' : ''} type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} />
        <FieldError message={fieldErrors.order} />
        <label className="check"><input type="checkbox" checked={form.highlighted} onChange={(e) => setForm((p) => ({ ...p, highlighted: e.target.checked }))} /> Highlighted</label>
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
      <div className="table-wrapper"><table><thead><tr><th>Title</th><th>Highlighted</th><th>Actions</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id}><td>{item.title}</td><td>{item.highlighted ? 'yes' : 'no'}</td><td className="row"><button className="muted" onClick={() => reorder(index, -1)}>Up</button><button className="muted" onClick={() => reorder(index, 1)}>Down</button><button className="muted" onClick={() => edit(item)}>Edit</button><button className="danger" onClick={() => remove(item.id)}>Delete</button></td></tr>)}</tbody></table></div>
      {dialog}
    </div>
  );
}
