import { useState, useRef, useEffect } from 'react';
import { Code2, History, Home, Settings, Keyboard, BarChart3, Palette } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { THEMES } from '../utils/themes';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/practice', label: 'Race', icon: Keyboard },
  { to: '/history', label: 'History', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Header({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (popRef.current && !popRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-xl"
      style={{ borderBottom: '1px solid var(--border)', background: 'color-mix(in srgb, var(--bg-base) 80%, transparent)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg focus:outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--accent)' }}>
          <span
            className="grid h-9 w-9 place-items-center rounded-xl ring-1"
            style={{ background: 'var(--accent-glow)', color: 'var(--accent)', ringColor: 'var(--tag-border)' }}
          >
            <Code2 size={20} style={{ color: 'var(--accent)' }} />
          </span>
          <span className="font-mono text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Code<span style={{ color: 'var(--accent)' }}>Rush</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${isActive ? 'active-nav' : 'inactive-nav'}`
              }
              style={({ isActive }) => isActive
                ? { background: 'rgba(255,255,255,0.07)', color: 'var(--accent)' }
                : { color: 'var(--text-muted)' }
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <div className="relative">
            <button
              ref={btnRef}
              onClick={() => setOpen(o => !o)}
              className="theme-pill"
              aria-label="Switch theme"
              aria-expanded={open}
            >
              <Palette size={13} />
              <span>{currentTheme.emoji} {currentTheme.name}</span>
            </button>

            {open && (
              <div ref={popRef} className="theme-switcher" role="listbox" aria-label="Theme options">
                <p className="mb-1 px-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Pick your vibe
                </p>
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    role="option"
                    aria-selected={theme === t.id}
                    className={`theme-option ${theme === t.id ? 'active' : ''}`}
                    onClick={() => { setTheme(t.id); setOpen(false); }}
                  >
                    <span className="text-lg">{t.emoji}</span>
                    <span className="flex-1 text-left">
                      <span className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</span>
                      <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>{t.description}</span>
                    </span>
                    <span className="theme-swatches">
                      {t.preview.map((c, i) => (
                        <span key={i} className="theme-swatch" style={{ background: c }} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="sm:hidden">
            <NavLink to="/practice" className="btn-primary px-3 py-2 text-sm">Race</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
