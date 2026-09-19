import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Code2, RefreshCw, Settings2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getLanguages } from '@whitep4nth3r/random-code';
import CodeDisplay from '../components/CodeDisplay';
import RaceConfiguration from '../components/RaceConfiguration';
import RaceStats from '../components/RaceStats';
import { generateSnippet, normalizeLanguages } from '../utils/snippet';
import { DEFAULT_SETTINGS, STORAGE_KEYS, safeGet, safeSet } from '../utils/storage';
import { useTypingRace } from '../hooks/useTypingRace';
import { formatWpm } from '../utils/metrics';

export default function Practice({ settings, setSettings }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [languages, setLanguages] = useState([]);
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const retry = location.state?.retrySnippet;
    if (retry?.code) {
      setSnippet(retry);
      setResult(null);
      window.history.replaceState({}, document.title, window.location.pathname);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [location.state]);

  useEffect(() => {
    try {
      const raw = getLanguages();
      const normalized = normalizeLanguages(raw);
      if (!normalized.length) throw new Error('No languages were returned by the code generator.');
      setLanguages(normalized);
      const stored = safeGet(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
      const preferred = stored?.language && normalized.some(l => l.key === stored.language) ? stored.language : normalized[0].key;
      if (!settings.language || !normalized.some(l => l.key === settings.language)) setSettings(s => ({...s, language: preferred}));
    } catch (e) { setError(e.message || 'Unable to load programming languages.'); }
  }, [setSettings, settings.language]);

  const selectedLanguage = useMemo(() => languages.find(l => l.key === settings.language) || null, [languages, settings.language]);
  const onFinish = useCallback((raceResult) => { setResult(raceResult); }, []);
  const { race, metrics, elapsedMs, inputRef, handleChange, restart, focus } = useTypingRace({ snippet: snippet?.code || '', language: selectedLanguage, difficulty: settings.difficulty, lineCount: snippet?.lineCount || 0, onFinish });

  useEffect(() => {
    if (result) navigate('/results', { state: { result, snippet }, replace: true });
  }, [result, navigate]);

  function changeSetting(key, value) { setSettings(prev => ({...prev, [key]: value})); }
  function startRace() {
    try { setError(''); setResult(null); setLoading(true); const generated = generateSnippet(settings.language, settings.snippetLength, settings.difficulty); setSnippet(generated); setLoading(false); requestAnimationFrame(() => inputRef.current?.focus()); } catch (e) { setLoading(false); setError(e.message || 'Could not generate a snippet.'); }
  }
  function newSnippet() { startRace(); }

  if (!snippet || !race.target) return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12"><div className="mb-8 flex items-center justify-between"><Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"><ArrowLeft size={16}/> Home</Link><Link to="/settings" className="btn-secondary px-3 py-2 text-sm"><Settings2 size={15}/> Settings</Link></div><div className="mx-auto max-w-4xl"><div className="mb-8"><p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-300">CodeRush practice</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Ready to race?</h1><p className="mt-2 text-slate-500">Pick a language and difficulty, then type the generated code exactly as shown.</p></div><RaceConfiguration languages={languages} settings={settings} onChange={changeSetting} onStart={startRace} loading={loading} error={error}/></div></main>;

  return <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><Link to="/" className="grid h-9 w-9 place-items-center rounded-lg border border-white/[.07] text-slate-400 hover:bg-white/[.04] hover:text-white" aria-label="Back home"><ArrowLeft size={17}/></Link><div><div className="flex items-center gap-2 font-mono text-sm font-semibold"><Code2 size={16} className="text-cyan-300"/>CodeRush</div><div className="mt-0.5 text-xs text-slate-600">{selectedLanguage?.name} · {snippet.lineCount} lines · {settings.difficulty}</div></div></div><div className="flex gap-2"><button onClick={restart} className="btn-secondary px-3 py-2 text-sm"><RefreshCw size={15}/> Restart</button><button onClick={newSnippet} className="btn-secondary px-3 py-2 text-sm"><RefreshCw size={15}/> New snippet</button><Link to="/settings" className="btn-secondary px-3 py-2 text-sm" aria-label="Open settings"><Settings2 size={15}/></Link></div></div><RaceStats metrics={metrics} elapsedMs={elapsedMs} onRestart={restart} progress={metrics.progress}/><div className="mt-4 flex items-center justify-between rounded-xl border border-white/[.06] bg-white/[.02] px-4 py-3 text-xs text-slate-500"><span className="inline-flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400"/>Timer starts with your first character</span><span className="font-mono">{formatWpm(metrics.wpm)} WPM</span></div><div className="mt-4" onClick={focus}><CodeDisplay target={race.target} typed={race.typed} inputRef={inputRef} onChange={handleChange} onFocus={focus} disabled={race.finished}/></div></main>;
}
