import { useEffect, useState } from 'react';
import { blogApi } from '../lib/api';
import type { BlogPost } from '../types/api';
import { arrayToCommaText, commaTextToArray } from '../lib/format';
import ImageUploader from '../components/ImageUploader';
import RichTextEditor from '../components/RichTextEditor';
import AutoTextarea from '../components/AutoTextarea';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { validateWithSchema, type FieldErrors } from '../lib/validation';
import FieldError from '../components/FieldError';
import useConfirmDialog from '../hooks/useConfirmDialog';

type Payload = Omit<BlogPost, 'id'>;

const defaults: Payload = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: [],
  publishedAt: '',
  readTime: 5,
  published: false,
};

const blogSchema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  slug: z.string().trim().min(2, 'Slug is required'),
  excerpt: z.string().trim().min(8, 'Excerpt is too short'),
  content: z.string().trim().min(20, 'Content is too short'),
  readTime: z.number().min(1, 'Read time must be at least 1'),
});

export default function BlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<Payload>(defaults);
  const [tagsText, setTagsText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { confirm, dialog } = useConfirmDialog();

  const load = async () => {
    const response = await blogApi.list();
    setItems(response.data.data || []);
  };

  useEffect(() => {
    load().catch(() => {
      toast.error('Failed to load blog posts');
    });
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload: Payload = {
      ...form,
      tags: commaTextToArray(tagsText),
      coverImage: form.coverImage || null,
      publishedAt: form.publishedAt || null,
    };

    const validation = validateWithSchema(blogSchema, payload);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    const previousItems = items;

    try {
      if (editingId) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        await blogApi.update(editingId, payload);
        toast.success('Blog post updated');
      } else {
        const tempId = Date.now() * -1;
        setItems((prev) => [...prev, { ...payload, id: tempId }]);
        await blogApi.create(payload);
        toast.success('Blog post created');
      }

      setForm(defaults);
      setTagsText('');
      setEditingId(null);
      await load();
    } catch {
      setItems(previousItems);
      toast.error('Failed to save blog post');
    }
  };

  const remove = async (id: number) => {
    const approved = await confirm({
      title: 'Delete Blog Post',
      description: 'This blog post will be permanently deleted.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!approved) {
      return;
    }

    const previousItems = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await blogApi.remove(id);
      toast.success('Blog post deleted');
    } catch {
      setItems(previousItems);
      toast.error('Failed to delete blog post');
    }
  };

  return (
    <div>
      <h2>Blog Posts</h2>
      <form onSubmit={save} className="grid-form">
        <input className={fieldErrors.title ? 'invalid' : ''} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" required />
        <FieldError message={fieldErrors.title} />
        <input className={fieldErrors.slug ? 'invalid' : ''} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="Slug" required />
        <FieldError message={fieldErrors.slug} />
        <AutoTextarea className={fieldErrors.excerpt ? 'invalid' : ''} value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} placeholder="Excerpt" required />
        <FieldError message={fieldErrors.excerpt} />
        <label>Content</label>
        <RichTextEditor value={form.content} onChange={(html) => setForm((p) => ({ ...p, content: html }))} />
        <FieldError message={fieldErrors.content} />
        <ImageUploader label="Cover Image" value={form.coverImage || ''} onChange={(url) => setForm((p) => ({ ...p, coverImage: url }))} />
        <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Tags (comma separated)" />
        <input value={form.publishedAt || ''} onChange={(e) => setForm((p) => ({ ...p, publishedAt: e.target.value }))} placeholder="Published At (YYYY-MM-DD)" />
        <input className={fieldErrors.readTime ? 'invalid' : ''} type="number" value={form.readTime} onChange={(e) => setForm((p) => ({ ...p, readTime: Number(e.target.value) }))} />
        <FieldError message={fieldErrors.readTime} />
        <label className="check"><input type="checkbox" checked={form.published} onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))} /> Published</label>
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
      <div className="table-wrapper"><table><thead><tr><th>Title</th><th>Published</th><th>Tags</th><th>Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.published ? 'yes' : 'no'}</td><td>{arrayToCommaText(item.tags)}</td><td className="row"><button className="muted" onClick={() => { setEditingId(item.id); setForm({ ...item, coverImage: item.coverImage || '', publishedAt: item.publishedAt || '' }); setTagsText(arrayToCommaText(item.tags)); }}>Edit</button><button className="danger" onClick={() => remove(item.id)}>Delete</button></td></tr>)}</tbody></table></div>
      {dialog}
    </div>
  );
}
