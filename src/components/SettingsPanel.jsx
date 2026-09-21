import { Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';
import { DifficultySelector, LanguageSelector, SnippetLengthSelector } from './Selector';

function Toggle({ on, onClick }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`toggle-track ${on ? 'on' : 'off'}`}
      style={on ? { background: 'var(--accent)' } : { background: 'rgba(255,255,255,0.1)' }}
    >
      <span className={`toggle-thumb ${on ? 'on' : 'off'}`} />
    </button>
  );
}

function SettingRow({ icon: Icon, label, description, on, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-4 py-4 text-left transition"
      style={{ border: '1px solid var(--border)', background: 'var(--accent-glow)' }}
    >
      <span className="flex items-center gap-3">
        <span
          className="grid h-9 w-9 place-items-center rounded-lg"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
        >
          <Icon size={18} style={{ color: 'var(--accent)' }} />
        </span>
        <span>
          <span className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
          <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>{description}</span>
        </span>
      </span>
      <Toggle on={on} onClick={e => { e.stopPropagation(); onClick(); }} />
    </button>
  );
}

export default function SettingsPanel({ settings, languages, onChange }) {
  return (
    <div className="panel p-5 sm:p-7">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[.18em]" style={{ color: 'var(--accent)' }}>Preferences</p>
        <h1 className="mt-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          Defaults are saved locally. Like your browsing history, but less embarrassing.
        </p>
      </div>

      {/* Language / Length / Difficulty */}
      <div className="grid gap-5 md:grid-cols-3">
        <LanguageSelector languages={languages} value={settings.language} onChange={(v) => onChange('language', v)} />
        <SnippetLengthSelector value={settings.snippetLength} onChange={(v) => onChange('snippetLength', v)} />
        <DifficultySelector value={settings.difficulty} onChange={(v) => onChange('difficulty', v)} />
      </div>

      {/* Toggles */}
      <div className="mt-7 space-y-2">
        <SettingRow
          icon={settings.sound ? Volume2 : VolumeX}
          label="Sound Effects"
          description={settings.sound ? 'Enabled. Your coworkers might object.' : 'Disabled. Silent mode. We respect the open office.'}
          on={settings.sound}
          onClick={() => onChange('sound', !settings.sound)}
        />
        <SettingRow
          icon={settings.reducedMotion ? ZapOff : Zap}
          label="Reduce Animations"
          description={settings.reducedMotion ? 'Animations off. Like your will to refactor that legacy codebase.' : 'Full animations on. Maximum drama, maximum speed.'}
          on={settings.reducedMotion}
          onClick={() => onChange('reducedMotion', !settings.reducedMotion)}
        />
      </div>

      {/* Info note */}
      <p className="mt-5 text-xs" style={{ color: 'var(--text-subtle)' }}>
        Changes apply instantly. No restart required. Unlike your prod server on patch day.
      </p>
    </div>
  );
}
