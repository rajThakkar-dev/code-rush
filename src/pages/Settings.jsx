import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SettingsPanel from '../components/SettingsPanel';

export default function Settings({ settings, setSettings, languages }) {
  function onChange(key, value) { setSettings(prev => ({ ...prev, [key]: value })); }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm transition hover:opacity-80"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={16} /> Home
      </Link>
      <SettingsPanel settings={settings} languages={languages} onChange={onChange} />
    </main>
  );
}
