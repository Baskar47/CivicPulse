import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Sun, Moon, Menu, X, Activity } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const doLogout = () => { logout(); toast.success('Signed out'); nav('/login'); };

  const links = isAdmin
    ? [{ to: '/admin', label: 'Dashboard' }, { to: '/admin/complaints', label: 'Complaints' }, { to: '/admin/users', label: 'Users' }]
    : [{ to: '/dashboard', label: 'Dashboard' }, { to: '/complaints', label: 'My Complaints' }, { to: '/complaints/new', label: 'New Report' }];

  const active = (to) => loc.pathname === to || (to.length > 8 && loc.pathname.startsWith(to));

  return (
    <nav className={`navbar ${scrolled ? 'glass-nav shadow-sm' : 'bg-transparent'}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="logo-mark">
          <div className="logo-icon">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <div className="logo-text">Civic<span className="text-blue-500">Pulse</span></div>
        </Link>

        {/* Desktop links */}
        <div className="nav-links hide-sm">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link ${active(l.to) ? 'active' : ''}`}>{l.label}</Link>
          ))}
        </div>

        {/* Right */}
        <div className="nav-right">
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {user ? (
            <div className="hide-sm flex items-center gap-3">
              <div className="avatar w-9 h-9 text-sm">{user?.name?.[0]?.toUpperCase()}</div>
              <div className="flex flex-col">
                <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</div>
                {isAdmin && <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Admin</div>}
              </div>
              <button onClick={doLogout} className="btn btn-outline btn-sm ml-2">Sign out</button>
            </div>
          ) : (
            <div className="hide-sm flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} className="btn btn-ghost btn-sm show-sm p-1">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 glass-nav border-t border-slate-200 dark:border-slate-800 p-4 shadow-lg show-sm animate-rise-up">
          {user ? (
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="avatar w-10 h-10 text-base">{user?.name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
              </div>
            </div>
          ) : null}
          
          <div className="flex flex-col gap-1">
            {user ? (
              <>
                {links.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`nav-link ${active(l.to) ? 'active' : ''}`}>{l.label}</Link>
                ))}
                <button onClick={doLogout} className="btn btn-outline btn-sm mt-3 w-full justify-center">Sign out</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" className="btn btn-outline btn-full" onClick={() => setOpen(false)}>Log in</Link>
                <Link to="/register" className="btn btn-primary btn-full" onClick={() => setOpen(false)}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
