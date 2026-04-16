import { useEffect, useState } from 'react';
import { contactApi } from '../lib/api';
import type { ContactMessage } from '../types/api';
import toast from 'react-hot-toast';
import useConfirmDialog from '../hooks/useConfirmDialog';

export default function ContactMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [error, setError] = useState('');
  const { confirm, dialog } = useConfirmDialog();

  const load = async () => {
    try {
      const response = await contactApi.list();
      setItems(response.data.data || []);
      setError('');
    } catch {
      setError('Failed to load contact messages');
      toast.error('Failed to load contact messages');
    }
  };

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  const markRead = async (id: number) => {
    const previous = items;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
    try {
      await contactApi.markRead(id);
      toast.success('Message marked as read');
    } catch {
      setItems(previous);
      toast.error('Failed to update message');
    }
  };

  const remove = async (id: number) => {
    const approved = await confirm({
      title: 'Delete Message',
      description: 'This contact message will be permanently removed.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!approved) {
      return;
    }

    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await contactApi.remove(id);
      toast.success('Message deleted');
    } catch {
      setItems(previous);
      toast.error('Failed to delete message');
    }
  };

  return (
    <div>
      <h2>Contact Messages</h2>
      {error ? <p className="error">{error}</p> : null}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.subject}</td>
                <td>{item.message}</td>
                <td>{item.read ? 'read' : 'unread'}</td>
                <td className="row">
                  {!item.read ? (
                    <button className="muted" onClick={() => markRead(item.id)}>
                      Mark Read
                    </button>
                  ) : null}
                  <button className="danger" onClick={() => remove(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dialog}
    </div>
  );
}
