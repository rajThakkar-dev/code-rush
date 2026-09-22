import { Bot, Eye, EyeOff, Skull, Shield } from 'lucide-react';
import { DifficultySelector, LanguageSelector, SnippetLengthSelector } from './Selector';

function Toggle({ on, onClick }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className="toggle-track"
      style={on ? { background: 'var(--accent)' } : { background: 'rgba(255,255,255,0.1)' }}
    >
      <span className={`toggle-thumb ${on ? 'on' : 'off'}`} />
    </button>
  );
}

function SettingRow({ icon: Icon, label, description, on, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-4 py-4 text-left transition"
      style={{
        border: `1px solid ${on && danger ? 'rgba(251,113,133,0.25)' : 'var(--border)'}`,
        background: on && danger ? 'rgba(251,113,133,0.06)' : 'var(--accent-glow)',
      }}
    >
      <span className="flex items-center gap-3">
        <span
          className="grid h-9 w-9 place-items-center rounded-lg"
          style={{
            background: on && danger ? 'rgba(251,113,133,0.1)' : 'rgba(255,255,255,0.05)',
            color: on && danger ? '#fda4af' : 'var(--accent)',
          }}
        >
          <Icon size={18} />
        </span>
        <span>
          <span className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
          <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>{description}</span>
        </span>
      </span>
      <Toggle
        on={on}
        onClick={e => { e.stopPropagation(); onClick(); }}
      />
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
      <div className="mt-7 space-y-3">

        {/* Instant Death */}
        <SettingRow
          icon={settings.instantDeath ? Skull : Shield}
          label="Instant Death Mode"
          description={
            settings.instantDeath
              ? 'One wrong key and you restart. Absolutely no mercy. For masochists only.'
              : 'One typo resets the entire race. Enable if you enjoy suffering.'
          }
          on={settings.instantDeath}
          onClick={() => onChange('instantDeath', !settings.instantDeath)}
          danger
        />

        {/* Zen Mode */}
        <SettingRow
          icon={settings.zenMode ? EyeOff : Eye}
          label="Zen Mode"
          description={
            settings.zenMode
              ? 'Stats hidden during the race. Ignorance is bliss. Results revealed on finish.'
              : 'Hide WPM, accuracy and timer while typing. Just you, the code, and silence.'
          }
          on={settings.zenMode}
          onClick={() => onChange('zenMode', !settings.zenMode)}
        />

        {/* VS Bot Mode */}
        <SettingRow
          icon={Bot}
          label="VS Bot Mode"
          description={
            settings.vsBot
              ? 'Racing a bot tuned to be slightly slower than your avg WPM. Beat it and feel smug.'
              : 'Enable to race against an AI bot calibrated to just below your average typing speed.'
          }
          on={settings.vsBot}
          onClick={() => onChange('vsBot', !settings.vsBot)}
        />

      </div>

      {/* Warning when both are on */}
      {settings.instantDeath && settings.zenMode && (
        <div
          className="mt-4 rounded-xl px-4 py-3 text-xs"
          style={{ border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.05)', color: '#fcd34d' }}
        >
          Both modes active. You are typing blind with zero tolerance for mistakes.
          This is either peak discipline or peak masochism. Respect.
        </div>
      )}

      <p className="mt-5 text-xs" style={{ color: 'var(--text-subtle)' }}>
        Changes apply instantly. No restart required. Unlike your prod server on patch day.
      </p>
    </div>
  );
}
