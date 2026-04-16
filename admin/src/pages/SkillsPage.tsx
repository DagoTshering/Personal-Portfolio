import { useEffect, useState } from 'react';
import { skillsApi } from '../lib/api';
import type { Skill } from '../types/api';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { validateWithSchema, type FieldErrors } from '../lib/validation';
import FieldError from '../components/FieldError';
import { swapByIndex } from '../lib/reorder';
import CustomSelect from '../components/CustomSelect';
import useConfirmDialog from '../hooks/useConfirmDialog';

type SkillPayload = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;

const defaultSkill: SkillPayload = {
  name: '',
  category: 'frontend',
  icon: 'code',
  proficiency: 3,
  order: 0,
};

const skillSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  category: z.enum(['frontend', 'backend', 'database', 'devops', 'tools']),
  icon: z.string().trim().min(1, 'Icon is required'),
  proficiency: z.number().min(1, 'Min is 1').max(5, 'Max is 5'),
  order: z.number().min(0, 'Order must be 0 or greater'),
});

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SkillPayload>(defaultSkill);
  const { confirm, dialog } = useConfirmDialog();

  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await skillsApi.list();
      setSkills(response.data.data || []);
      setError(null);
    } catch {
      setError('Failed to load skills');
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills().catch(() => {
      setError('Failed to load skills');
    });
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultSkill);
    setFieldErrors({});
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      icon: skill.icon,
      proficiency: skill.proficiency,
      order: skill.order,
    });
    setFieldErrors({});
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateWithSchema(skillSchema, form);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});

    const previousSkills = skills;

    try {
      if (editingId) {
        setSkills((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? { ...item, ...validation.data, updatedAt: new Date().toISOString() }
              : item
          )
        );
        await skillsApi.update(editingId, form);
        toast.success('Skill updated');
      } else {
        const tempId = Date.now() * -1;
        setSkills((prev) => [
          ...prev,
          {
            id: tempId,
            ...validation.data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
        await skillsApi.create(form);
        toast.success('Skill created');
      }
      await loadSkills();
      resetForm();
    } catch {
      setSkills(previousSkills);
      setError('Failed to save skill');
      toast.error('Failed to save skill');
    }
  };

  const handleDelete = async (id: number) => {
    const approved = await confirm({
      title: 'Delete Skill',
      description: 'This skill will be removed from your portfolio.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!approved) {
      return;
    }

    const previousSkills = skills;
    try {
      setSkills((prev) => prev.filter((item) => item.id !== id));
      await skillsApi.remove(id);
      toast.success('Skill deleted');
    } catch {
      setSkills(previousSkills);
      setError('Failed to delete skill');
      toast.error('Failed to delete skill');
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const current = skills[index];
    const target = skills[targetIndex];
    const optimistic = swapByIndex(skills, index, targetIndex).map((item, idx) => ({
      ...item,
      order: idx,
    }));

    setSkills(optimistic);

    try {
      await Promise.all([
        skillsApi.update(current.id, {
          name: current.name,
          category: current.category,
          icon: current.icon,
          proficiency: current.proficiency,
          order: targetIndex,
        }),
        skillsApi.update(target.id, {
          name: target.name,
          category: target.category,
          icon: target.icon,
          proficiency: target.proficiency,
          order: index,
        }),
      ]);
      toast.success('Order updated');
    } catch {
      setSkills((prev) => prev);
      await loadSkills();
      toast.error('Failed to reorder skills');
    }
  };

  return (
    <div>
      <h2>Skills</h2>
      <p className="subtitle">Create, update, and delete skills used in the public portfolio.</p>

      <form className="card skill-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Skill' : 'Add Skill'}</h3>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          className={fieldErrors.name ? 'invalid' : ''}
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <FieldError message={fieldErrors.name} />

        <label htmlFor="category">Category</label>
        <CustomSelect
          value={form.category}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              category: value as SkillPayload['category'],
            }))
          }
          options={[
            { value: 'frontend', label: 'frontend' },
            { value: 'backend', label: 'backend' },
            { value: 'database', label: 'database' },
            { value: 'devops', label: 'devops' },
            { value: 'tools', label: 'tools' },
          ]}
        />

        <label htmlFor="icon">Icon</label>
        <input
          id="icon"
          className={fieldErrors.icon ? 'invalid' : ''}
          value={form.icon}
          onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
          required
        />
        <FieldError message={fieldErrors.icon} />

        <label htmlFor="proficiency">Proficiency (1-5)</label>
        <input
          id="proficiency"
          type="number"
          className={fieldErrors.proficiency ? 'invalid' : ''}
          min={1}
          max={5}
          value={form.proficiency}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, proficiency: Number(e.target.value) || 1 }))
          }
          required
        />
        <FieldError message={fieldErrors.proficiency} />

        <label htmlFor="order">Order</label>
        <input
          id="order"
          type="number"
          className={fieldErrors.order ? 'invalid' : ''}
          value={form.order}
          onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
          required
        />
        <FieldError message={fieldErrors.order} />

        <div className="row">
          <button type="submit">{editingId ? 'Update Skill' : 'Create Skill'}</button>
          {editingId ? (
            <button type="button" className="muted" onClick={resetForm}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {loading ? <p>Loading skills...</p> : null}

      {!loading ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Icon</th>
                <th>Proficiency</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill, index) => (
                <tr key={skill.id}>
                  <td>{skill.name}</td>
                  <td>{skill.category}</td>
                  <td>{skill.icon}</td>
                  <td>{skill.proficiency}</td>
                  <td>{skill.order}</td>
                  <td className="row">
                    <button type="button" className="muted" onClick={() => handleMove(index, -1)}>
                      Up
                    </button>
                    <button type="button" className="muted" onClick={() => handleMove(index, 1)}>
                      Down
                    </button>
                    <button type="button" className="muted" onClick={() => handleEdit(skill)}>
                      Edit
                    </button>
                    <button type="button" className="danger" onClick={() => handleDelete(skill.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {dialog}
    </div>
  );
}
