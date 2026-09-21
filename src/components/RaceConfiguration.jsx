import { Play, Sparkles } from 'lucide-react';
import { DifficultySelector, LanguageSelector, SnippetLengthSelector } from './Selector';

export default function RaceConfiguration({ languages, settings, onChange, onStart, loading, error }) {
  return (
    <section className="panel p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
            Configure race
          </p>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Choose your difficulty setting
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Fresh snippet generated in your browser. No lorem ipsum. Actual code you might encounter at 2am on a production hotfix.
          </p>
        </div>
        <Sparkles className="hidden sm:block" size={20} style={{ color: 'var(--accent)', opacity: 0.7 }} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <LanguageSelector languages={languages} value={settings.language} onChange={(v) => onChange('language', v)} />
        <SnippetLengthSelector value={settings.snippetLength} onChange={(v) => onChange('snippetLength', v)} />
        <DifficultySelector value={settings.difficulty} onChange={(v) => onChange('difficulty', v)} />
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl px-4 py-3 text-sm"
          style={{ border: '1px solid rgba(251,113,133,0.2)', background: 'rgba(251,113,133,0.05)', color: '#fda4af' }}
        >
          {error}
        </div>
      )}

      <button
        className="btn-primary mt-5 w-full sm:w-auto"
        onClick={onStart}
        disabled={loading || !settings.language}
      >
        {loading ? 'Summoning code from the void...' : <><Play size={17} fill="currentColor" /> Start race</>}
      </button>
    </section>
  );
}
