import { Play, Sparkles } from 'lucide-react';
import { DifficultySelector, LanguageSelector, SnippetLengthSelector } from './Selector';

export default function RaceConfiguration({ languages, settings, onChange, onStart, loading, error }) {
  return <section className="panel p-5 sm:p-6">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div><p className="mb-1 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Configure race</p><h2 className="text-xl font-semibold">Choose your challenge</h2><p className="mt-1 text-sm text-slate-500">The library generates a fresh snippet locally in your browser.</p></div>
      <Sparkles className="hidden text-cyan-300/70 sm:block" size={20}/>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <LanguageSelector languages={languages} value={settings.language} onChange={(v)=>onChange('language',v)} />
      <SnippetLengthSelector value={settings.snippetLength} onChange={(v)=>onChange('snippetLength',v)} />
      <DifficultySelector value={settings.difficulty} onChange={(v)=>onChange('difficulty',v)} />
    </div>
    {error && <div role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-200">{error}</div>}
    <button className="btn-primary mt-5 w-full sm:w-auto" onClick={onStart} disabled={loading || !settings.language}>{loading ? 'Generating…' : <><Play size={17} fill="currentColor"/> Start race</>}</button>
  </section>;
}
