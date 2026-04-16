import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  FolderKanban,
  Gauge,
  Hammer,
  Home,
  Layers,
  Menu,
  MessageSquare,
  Settings,
  Star,
  User,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/auth';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Gauge },
  { to: '/hero', label: 'Hero', icon: Home },
  { to: '/about', label: 'About', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/skills', label: 'Skills', icon: Hammer },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/experience', label: 'Experience', icon: Briefcase },
  { to: '/services', label: 'Services', icon: Wrench },
  { to: '/testimonials', label: 'Testimonials', icon: Star },
  { to: '/blog', label: 'Blog', icon: BookOpen },
  { to: '/social-links', label: 'Social Links', icon: Users },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/content', label: 'Content Hub', icon: Layers },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout">
      {isMobileMenuOpen ? (
        <button
          type="button"
          className="menu-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      ) : null}

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header row">
          <h1>Portfolio Admin</h1>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nav-link-inner">
                <item.icon size={16} />
                <span>{item.label}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div className="topbar-user">
            <div>
              <p className="title">Welcome back</p>
              <p className="subtitle">{user?.email}</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              className="menu-toggle"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        <section className="panel">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
