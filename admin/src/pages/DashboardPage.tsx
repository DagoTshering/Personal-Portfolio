import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api';
import type { DashboardStats } from '../types/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminApi.dashboard();
        setStats(response.data.data?.stats || null);
      } catch {
        setError('Failed to load dashboard stats');
      }
    };

    loadStats().catch(() => {
      setError('Failed to load dashboard stats');
    });
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!stats) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p className="subtitle">Overview of your content status.</p>
      <div className="stats-grid">
        <article className="stat-card"><h3>Skills</h3><p>{stats.skills}</p></article>
        <article className="stat-card"><h3>Projects</h3><p>{stats.projects}</p></article>
        <article className="stat-card"><h3>Experience</h3><p>{stats.experience}</p></article>
        <article className="stat-card"><h3>Services</h3><p>{stats.services}</p></article>
        <article className="stat-card"><h3>Blog Posts</h3><p>{stats.blogPosts}</p></article>
        <article className="stat-card"><h3>Messages</h3><p>{stats.messages}</p></article>
        <article className="stat-card"><h3>Unread Messages</h3><p>{stats.unreadMessages}</p></article>
      </div>
    </div>
  );
}
