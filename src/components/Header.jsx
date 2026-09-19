import { Code2, History, Home, Settings, Keyboard, BarChart3 } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/practice', label: 'Practice', icon: Keyboard },
  { to: '/history', label: 'History', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Header() {
  return <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#050a12]/80 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
      <Link to="/" className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-300/60 rounded-lg">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/20"><Code2 size={20}/></span>
        <span className="font-mono text-lg font-semibold tracking-tight">Code<span className="text-cyan-300">Rush</span></span>
      </Link>
      <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({isActive}) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-white/[0.07] text-cyan-300' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'}`}><Icon size={16}/>{label}</NavLink>)}
      </nav>
      <div className="sm:hidden"><NavLink to="/practice" className="btn-primary px-3 py-2 text-sm">Practice</NavLink></div>
    </div>
  </header>;
}
