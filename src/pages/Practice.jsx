import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Bot, CheckCircle2, Code2, Eye, RefreshCw, Settings2, Play, Skull } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getLanguages } from '@whitep4nth3r/random-code';
import CodeDisplay from '../components/CodeDisplay';
import RaceConfiguration from '../components/RaceConfiguration';
import RaceStats from '../components/RaceStats';
import BotRacer from '../components/BotRacer';
import BotWinsModal from '../components/BotWinsModal';
import PasteRoastModal from '../components/PasteRoastModal';
import { generateSnippet, normalizeLanguages } from '../utils/snippet';
import { DEFAULT_SETTINGS, STORAGE_KEYS, safeGet, safeSet, getUserAvgWpm } from '../utils/storage';
import { useTypingRace } from '../hooks/useTypingRace';
import { formatWpm } from '../utils/metrics';

// Bot is slightly faster than user avg: add a small delta (5-12 WPM)
function computeBotWpm(userAvg) {
  const delta = Math.floor(Math.random() * 8) + 5; // 5–12 WPM faster
  return userAvg + delta;
}

export default function Practice({ settings, setSettings }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [languages, setLanguages] = useState([]);
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  // Bot mode state
  const [botWpm, setBotWpm] = useState(null);
  const [botWon, setBotWon] = useState(false);

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
      if (!normalized.length) throw new Error('No languages returned. The compiler is on strike.');
      setLanguages(normalized);
      const stored = safeGet(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
      const preferred = stored?.language && normalized.some(l => l.key === stored.language)
        ? stored.language
        : normalized[0].key;
      if (!settings.language || !normalized.some(l => l.key === settings.language)) {
        setSettings(s => ({ ...s, language: preferred }));
      }
    } catch (e) {
      setError(e.message || 'Could not load languages. The code generator is having an existential crisis.');
    }
  }, [setSettings, settings.language]);

  const selectedLanguage = useMemo(
    () => languages.find(l => l.key === settings.language) || null,
    [languages, settings.language]
  );

  const onFinish = useCallback((raceResult) => {
    setBotWon(false); // user finished — bot didn't win
    setResult(raceResult);
  }, []);

  const onBotFinish = useCallback(() => {
    // Only trigger if user hasn't finished yet
    setBotWon(true);
  }, []);

  const { race, metrics, elapsedMs, inputRef, handleChange, handlePaste, closePasteModal, pasteBlocked, restart, focus, shaking } = useTypingRace({
    snippet: snippet?.code || '',
    language: selectedLanguage,
    difficulty: settings.difficulty,
    lineCount: snippet?.lineCount || 0,
    onFinish,
    instantDeath: settings.instantDeath,
  });

  useEffect(() => {
    if (result) navigate('/results', { state: { result, snippet }, replace: true });
  }, [result, navigate]);

  function changeSetting(key, value) { setSettings(prev => ({ ...prev, [key]: value })); }

  function handleBotWinRematch() {
    setBotWon(false);
    restart();
    // Keep same botWpm for the rematch
  }

  function startRace() {
    try {
      setError('');
      setResult(null);
      setBotWon(false);
      setLoading(true);
      const generated = generateSnippet(settings.language, settings.snippetLength, settings.difficulty);
      setSnippet(generated);
      // Compute bot WPM fresh for each new race
      if (settings.vsBot) {
        const userAvg = getUserAvgWpm();
        setBotWpm(computeBotWpm(userAvg));
      } else {
        setBotWpm(null);
      }
      setLoading(false);
      requestAnimationFrame(() => {
        setTimeout(() => inputRef.current?.focus(), 50);
      });
    } catch (e) {
      setLoading(false);
      setError(e.message || 'Could not generate a snippet. Even the random code generator gave up.');
    }
  }

  // Auto-focus when snippet appears in DOM
  useEffect(() => {
    if (snippet && race.target) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [snippet, race.target]);

  function newSnippet() { startRace(); }

  // Zen mode: hide stats while actively racing, show once finished
  const zenActive = settings.zenMode && race.running && !race.finished;

  if (!snippet || !race.target) return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm transition hover:opacity-80"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} /> Home
        </Link>
        <Link to="/settings" className="btn-secondary px-3 py-2 text-sm">
          <Settings2 size={15} /> Settings
        </Link>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[.18em]" style={{ color: 'var(--accent)' }}>CodeRush</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Ready to embarrass yourself?
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Pick a language and difficulty. We generate fresh code, you type it. Simple. Brutal. Educational.
          </p>
          {/* Active mode indicators */}
          <div className="mt-3 flex flex-wrap gap-2">
            {settings.instantDeath && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: 'rgba(251,113,133,0.1)', color: '#fda4af', border: '1px solid rgba(251,113,133,0.2)' }}>
                <Skull size={11} /> Instant Death ON
              </span>
            )}
            {settings.zenMode && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--tag-border)' }}>
                <Eye size={11} /> Zen Mode ON
              </span>
            )}
            {settings.vsBot && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: 'rgba(139,92,246,0.08)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Bot size={11} /> VS Bot ON
              </span>
            )}
          </div>
        </div>
        <RaceConfiguration
          languages={languages}
          settings={settings}
          onChange={changeSetting}
          onStart={startRace}
          loading={loading}
          error={error}
        />
      </div>
    </main>
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
      {/* Paste Roast Modal */}
      <PasteRoastModal visible={pasteBlocked} onClose={closePasteModal} />

      {/* Bot Wins Modal */}
      <BotWinsModal
        visible={botWon}
        botWpm={botWpm}
        userWpm={metrics.wpm}
        onRetry={handleBotWinRematch}
        onNewSnippet={newSnippet}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="grid h-9 w-9 place-items-center rounded-lg transition hover:opacity-80"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            aria-label="Back home"
          >
            <ArrowLeft size={17} />
          </Link>
          <div>
            <div className="flex items-center gap-2 font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <Code2 size={16} style={{ color: 'var(--accent)' }} />
              CodeRush
              {settings.instantDeath && (
                <span className="ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold" style={{ background: 'rgba(251,113,133,0.12)', color: '#fda4af' }}>
                  <Skull size={9} /> INSTANT DEATH
                </span>
              )}
              {settings.zenMode && !settings.instantDeath && (
                <span className="ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                  <Eye size={9} /> ZEN
                </span>
              )}
              {settings.vsBot && botWpm && (
                <span className="ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>
                  <Bot size={9} /> vs BOT {Math.round(botWpm)} WPM
                </span>
              )}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: 'var(--text-subtle)' }}>
              {selectedLanguage?.name} &middot; {snippet.lineCount} lines &middot; {settings.difficulty}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={restart} className="btn-secondary px-3 py-2 text-sm">
            <RefreshCw size={15} /> Restart
          </button>
          <button onClick={newSnippet} className="btn-secondary px-3 py-2 text-sm">
            <Play size={15} /> New snippet
          </button>
          <Link to="/settings" className="btn-secondary px-3 py-2 text-sm" aria-label="Open settings">
            <Settings2 size={15} />
          </Link>
        </div>
      </div>

      {/* Stats bar: hidden during zen mode race, visible before/after */}
      <div className={zenActive ? 'zen-stats-hidden' : ''}>
        <RaceStats metrics={metrics} elapsedMs={elapsedMs} onRestart={restart} progress={metrics.progress} />
      </div>

      {/* Zen mode active overlay shown in place of stats */}
      {zenActive && (
        <div className="zen-overlay">
          <Eye size={13} />
          Zen mode. No stats. Just you and the code. You've got this.
        </div>
      )}

      {/* Bot racer lane */}
      {settings.vsBot && botWpm && (
        <BotRacer
          botWpm={botWpm}
          targetLength={snippet?.code?.length || 1}
          running={race.running}
          finished={race.finished}
          paused={pasteBlocked}
          onBotFinish={onBotFinish}
        />
      )}

      {/* Hint bar: hidden during zen mode, always show WPM after finish */}
      {!zenActive && (
        <div
          className="mt-4 flex items-center justify-between rounded-xl px-4 py-3 text-xs"
          style={{ border: '1px solid var(--border)', background: 'var(--accent-glow)', color: 'var(--text-muted)' }}
        >
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 size={14} style={{ color: '#34d399' }} />
            {settings.instantDeath
              ? 'One wrong key resets the race. No mercy. No survivors.'
              : 'Timer starts with your first keystroke. No pressure. All pressure.'}
          </span>
          <span className="font-mono" style={{ color: 'var(--accent)' }}>
            {formatWpm(metrics.wpm)} WPM
          </span>
        </div>
      )}

      {/* Code editor - shake on instant death error */}
      <div className={`mt-4 ${shaking ? 'cr-shake' : ''}`} onClick={focus}>
        <CodeDisplay
          target={race.target}
          typed={race.typed}
          inputRef={inputRef}
          onChange={handleChange}
          onPaste={handlePaste}
          onFocus={focus}
          disabled={race.finished}
        />
      </div>
    </main>
  );
}
