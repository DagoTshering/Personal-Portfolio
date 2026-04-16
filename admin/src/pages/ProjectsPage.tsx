import { useEffect, useState } from 'react';
import { projectsApi } from '../lib/api';
import type { Project } from '../types/api';
import { arrayToText, textToArray } from '../lib/format';
import ImageUploader from '../components/ImageUploader';
import AutoTextarea from '../components/AutoTextarea';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { validateWithSchema, type FieldErrors } from '../lib/validation';
import FieldError from '../components/FieldError';
import { swapByIndex } from '../lib/reorder';
import CustomSelect from '../components/CustomSelect';
import useConfirmDialog from '../hooks/useConfirmDialog';

type Payload = Omit<Project, 'id'>;

const defaults: Payload = {
  title: '',
  slug: '',
  description: '',
  longDescription: '',
  thumbnail: '',
  images: [],
  techStack: [],
  category: 'web',
  featured: false,
  order: 0,
  liveUrl: '',
  githubUrl: '',
  published: true,
};

const projectSchema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  slug: z.string().trim().min(2, 'Slug is required'),
  description: z.string().trim().min(10, 'Description is too short'),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  order: z.number().min(0, 'Order must be non-negative'),
});

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState<Payload>(defaults);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagesText, setImagesText] = useState('');
  const [techText, setTechText] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { confirm, dialog } = useConfirmDialog();

  const load = async () => {
    const response = await projectsApi.list();
    setItems(response.data.data || []);
  };

  useEffect(() => {
    load().catch(() => {
      setMessage('Failed to load projects');
      toast.error('Failed to load projects');
    });
  }, []);

  const edit = (item: Project) => {
    setEditingId(item.id);
    setForm({ ...item, longDescription: item.longDescription || '', liveUrl: item.liveUrl || '', githubUrl: item.githubUrl || '' });
    setImagesText(arrayToText(item.images));
    setTechText(arrayToText(item.techStack));
  };

  const reset = () => {
    setEditingId(null);
    setForm(defaults);
    setImagesText('');
    setTechText('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload: Payload = {
      ...form,
      images: textToArray(imagesText),
      techStack: textToArray(techText),
      longDescription: form.longDescription || null,
      liveUrl: form.liveUrl || null,
      githubUrl: form.githubUrl || null,
    };

    const validation = validateWithSchema(projectSchema, payload);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    const previousItems = items;

    try {
      if (editingId) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        await projectsApi.update(editingId, payload);
        toast.success('Project updated');
      } else {
        const tempId = Date.now() * -1;
        setItems((prev) => [...prev, { ...payload, id: tempId }]);
        await projectsApi.create(payload);
        toast.success('Project created');
      }
      await load();
      reset();
      setMessage('Saved');
    } catch {
      setItems(previousItems);
      setMessage('Failed to save project');
      toast.error('Failed to save project');
    }
  };

  const remove = async (id: number) => {
    const approved = await confirm({
      title: 'Delete Project',
      description: 'This project will be permanently removed.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!approved) {
      return;
    }

    const previousItems = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await projectsApi.remove(id);
      toast.success('Project deleted');
    } catch {
      setItems(previousItems);
      toast.error('Failed to delete project');
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
        projectsApi.update(current.id, { ...current, order: targetIndex }),
        projectsApi.update(target.id, { ...target, order: index }),
      ]);
      toast.success('Order updated');
    } catch {
      await load();
      toast.error('Failed to reorder projects');
    }
  };

  return (
    <div>
      <h2>Projects</h2>
      <form onSubmit={submit} className="grid-form">
        <input className={fieldErrors.title ? 'invalid' : ''} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" required />
        <FieldError message={fieldErrors.title} />
        <input className={fieldErrors.slug ? 'invalid' : ''} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="Slug" required />
        <FieldError message={fieldErrors.slug} />
        <AutoTextarea className={fieldErrors.description ? 'invalid' : ''} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" required />
        <FieldError message={fieldErrors.description} />
        <AutoTextarea value={form.longDescription || ''} onChange={(e) => setForm((p) => ({ ...p, longDescription: e.target.value }))} placeholder="Long Description" />
        <ImageUploader label="Thumbnail" value={form.thumbnail} onChange={(url) => setForm((p) => ({ ...p, thumbnail: url }))} />
        <AutoTextarea value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder="Images (one URL per line)" />
        <AutoTextarea value={techText} onChange={(e) => setTechText(e.target.value)} placeholder="Tech stack (one per line)" />
        <CustomSelect
          value={form.category}
          onChange={(value) => setForm((p) => ({ ...p, category: value as Payload['category'] }))}
          options={[
            { value: 'web', label: 'web' },
            { value: 'api', label: 'api' },
            { value: 'mobile', label: 'mobile' },
            { value: 'oss', label: 'oss' },
          ]}
        />
        <input className={fieldErrors.order ? 'invalid' : ''} type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} />
        <FieldError message={fieldErrors.order} />
        <input value={form.liveUrl || ''} onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))} placeholder="Live URL" />
        <input value={form.githubUrl || ''} onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))} placeholder="GitHub URL" />
        <label className="check"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} /> Featured</label>
        <label className="check"><input type="checkbox" checked={form.published} onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))} /> Published</label>
        <div className="row"><button type="submit">{editingId ? 'Update' : 'Create'}</button>{editingId ? <button type="button" className="muted" onClick={reset}>Cancel</button> : null}</div>
      </form>
      {message ? <p>{message}</p> : null}
      <div className="table-wrapper"><table><thead><tr><th>Title</th><th>Category</th><th>Order</th><th>Published</th><th>Actions</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id}><td>{item.title}</td><td>{item.category}</td><td>{item.order}</td><td>{item.published ? 'yes' : 'no'}</td><td className="row"><button className="muted" onClick={() => reorder(index, -1)}>Up</button><button className="muted" onClick={() => reorder(index, 1)}>Down</button><button className="muted" onClick={() => edit(item)}>Edit</button><button className="danger" onClick={() => remove(item.id)}>Delete</button></td></tr>)}</tbody></table></div>
      {dialog}
    </div>
  );
}
