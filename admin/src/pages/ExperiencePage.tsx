import { useEffect, useState } from 'react';
import { experienceApi } from '../lib/api';
import type { Experience } from '../types/api';
import { arrayToText, textToArray } from '../lib/format';
import AutoTextarea from '../components/AutoTextarea';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { validateWithSchema, type FieldErrors } from '../lib/validation';
import FieldError from '../components/FieldError';
import { swapByIndex } from '../lib/reorder';
import CustomSelect from '../components/CustomSelect';
import useConfirmDialog from '../hooks/useConfirmDialog';

type Payload = Omit<Experience, 'id'>;

const defaults: Payload = {
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  description: [],
  location: '',
  type: 'fulltime',
  order: 0,
};

const experienceSchema = z.object({
  company: z.string().trim().min(2, 'Company is required'),
  role: z.string().trim().min(2, 'Role is required'),
  startDate: z.string().trim().min(4, 'Start date is required'),
  location: z.string().trim().min(2, 'Location is required'),
  order: z.number().min(0, 'Order must be non-negative'),
});

export default function ExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [form, setForm] = useState<Payload>(defaults);
  const [descText, setDescText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { confirm, dialog } = useConfirmDialog();

  const load = async () => {
    const response = await experienceApi.list();
    setItems(response.data.data || []);
  };

  useEffect(() => {
    load().catch(() => toast.error('Failed to load experience'));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload: Payload = {
      ...form,
      endDate: form.endDate || null,
      description: textToArray(descText),
    };

    const validation = validateWithSchema(experienceSchema, payload);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    const previous = items;

    try {
      if (editingId) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        await experienceApi.update(editingId, payload);
        toast.success('Experience updated');
      } else {
        const tempId = Date.now() * -1;
        setItems((prev) => [...prev, { ...payload, id: tempId }]);
        await experienceApi.create(payload);
        toast.success('Experience created');
      }

      setEditingId(null);
      setForm(defaults);
      setDescText('');
      await load();
    } catch {
      setItems(previous);
      toast.error('Failed to save experience');
    }
  };

  const edit = (item: Experience) => {
    setEditingId(item.id);
    setForm({ ...item, endDate: item.endDate || '' });
    setDescText(arrayToText(item.description));
    setFieldErrors({});
  };

  const remove = async (id: number) => {
    const approved = await confirm({
      title: 'Delete Experience',
      description: 'This experience entry will be removed from your profile.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!approved) {
      return;
    }

    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await experienceApi.remove(id);
      toast.success('Experience deleted');
    } catch {
      setItems(previous);
      toast.error('Failed to delete experience');
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
        experienceApi.update(current.id, { ...current, order: targetIndex }),
        experienceApi.update(target.id, { ...target, order: index }),
      ]);
      toast.success('Order updated');
    } catch {
      await load();
      toast.error('Failed to reorder experience');
    }
  };

  return (
    <div>
      <h2>Experience</h2>
      <form onSubmit={submit} className="grid-form">
        <input className={fieldErrors.company ? 'invalid' : ''} value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company" required />
        <FieldError message={fieldErrors.company} />
        <input className={fieldErrors.role ? 'invalid' : ''} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="Role" required />
        <FieldError message={fieldErrors.role} />
        <input className={fieldErrors.startDate ? 'invalid' : ''} value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} placeholder="Start date YYYY-MM" required />
        <FieldError message={fieldErrors.startDate} />
        <input value={form.endDate || ''} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} placeholder="End date YYYY-MM" />
        <input className={fieldErrors.location ? 'invalid' : ''} value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" required />
        <FieldError message={fieldErrors.location} />
        <CustomSelect
          value={form.type}
          onChange={(value) => setForm((p) => ({ ...p, type: value as Payload['type'] }))}
          options={[
            { value: 'fulltime', label: 'fulltime' },
            { value: 'contract', label: 'contract' },
            { value: 'freelance', label: 'freelance' },
          ]}
        />
        <input className={fieldErrors.order ? 'invalid' : ''} type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} />
        <FieldError message={fieldErrors.order} />
        <label className="check"><input type="checkbox" checked={form.current} onChange={(e) => setForm((p) => ({ ...p, current: e.target.checked }))} /> Current</label>
        <AutoTextarea value={descText} onChange={(e) => setDescText(e.target.value)} placeholder="Bullet points (one per line)" />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
      <div className="table-wrapper"><table><thead><tr><th>Company</th><th>Role</th><th>Type</th><th>Actions</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id}><td>{item.company}</td><td>{item.role}</td><td>{item.type}</td><td className="row"><button className="muted" onClick={() => reorder(index, -1)}>Up</button><button className="muted" onClick={() => reorder(index, 1)}>Down</button><button className="muted" onClick={() => edit(item)}>Edit</button><button className="danger" onClick={() => remove(item.id)}>Delete</button></td></tr>)}</tbody></table></div>
      {dialog}
    </div>
  );
}
