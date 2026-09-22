import { useEffect, useRef, useState } from 'react';
import { Bot } from 'lucide-react';

/**
 * BotRacer – shows an animated bot progress lane below the user's progress.
 * Props:
 *   botWpm       – the WPM the bot is racing at
 *   targetLength – total characters in the snippet
 *   running      – whether the race has started
 *   finished     – whether the user finished (stops the bot at current pos)
 *   paused       – whether to freeze the bot (e.g. paste modal open)
 *   onBotFinish  – callback fired when the bot reaches 100% before the user
 */
export default function BotRacer({ botWpm, targetLength, running, finished, paused, onBotFinish }) {
  const [botProgress, setBotProgress] = useState(0); // 0-100
  const botStartRef = useRef(null);
  const pausedAtRef = useRef(null);
  const pausedProgressRef = useRef(0);
  const rafRef = useRef(null);
  const botFinishedRef = useRef(false);

  // Reset on new race
  useEffect(() => {
    setBotProgress(0);
    botStartRef.current = null;
    pausedAtRef.current = null;
    pausedProgressRef.current = 0;
    botFinishedRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, [targetLength]);

  useEffect(() => {
    if (!running || finished) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    // Handle pause/resume
    if (paused) {
      if (pausedAtRef.current === null) {
        pausedAtRef.current = performance.now();
        pausedProgressRef.current = botProgress;
      }
      cancelAnimationFrame(rafRef.current);
      return;
    }

    // Resume after pause: shift the start time so bot doesn't jump
    if (pausedAtRef.current !== null) {
      const pausedDuration = performance.now() - pausedAtRef.current;
      if (botStartRef.current !== null) {
        botStartRef.current += pausedDuration;
      }
      pausedAtRef.current = null;
    }

    const charsPerMs = (botWpm * 5) / 60000; // chars per millisecond

    const tick = (now) => {
      if (botStartRef.current === null) botStartRef.current = now;
      const elapsed = now - botStartRef.current;
      const charsTyped = elapsed * charsPerMs;
      const pct = Math.min(100, (charsTyped / targetLength) * 100);
      setBotProgress(pct);

      if (pct >= 100) {
        // Bot finished — fire callback once if user hasn't finished yet
        if (!botFinishedRef.current && !finished) {
          botFinishedRef.current = true;
          onBotFinish?.();
        }
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, finished, paused, botWpm, targetLength]);

  if (!running && botProgress === 0) return null;

  const isDone = botProgress >= 100;

  return (
    <div
      className="mt-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-mono"
      style={{
        border: `1px solid ${isDone ? 'rgba(139,92,246,0.5)' : 'var(--border)'}`,
        background: isDone ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.06)',
        color: 'var(--text-muted)',
        transition: 'border-color 0.3s, background 0.3s',
      }}
    >
      <Bot size={14} style={{ color: isDone ? '#c4b5fd' : '#a78bfa', flexShrink: 0 }} />
      <span style={{ color: isDone ? '#c4b5fd' : '#a78bfa', fontWeight: 600, whiteSpace: 'nowrap' }}>
        {isDone ? '🏁 BOT DONE' : `BOT · ${Math.round(botWpm)} WPM`}
      </span>
      <div
        className="relative flex-1 overflow-hidden rounded-full"
        style={{ height: '6px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
      >
        <div
          style={{
            height: '100%',
            width: `${botProgress}%`,
            background: isDone
              ? 'linear-gradient(90deg, #7c3aed, #c4b5fd)'
              : 'linear-gradient(90deg, #7c3aed, #a78bfa)',
            borderRadius: '9999px',
            transition: 'width 0.1s linear',
            boxShadow: isDone ? '0 0 12px rgba(167,139,250,0.9)' : '0 0 8px rgba(167,139,250,0.5)',
          }}
        />
        {/* Bot avatar dot */}
        {!isDone && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `calc(${botProgress}% - 5px)`,
              transform: 'translateY(-50%)',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#a78bfa',
              border: '2px solid var(--bg-base)',
              boxShadow: '0 0 6px rgba(167,139,250,0.8)',
              transition: 'left 0.1s linear',
            }}
          />
        )}
      </div>
      <span style={{ whiteSpace: 'nowrap', color: isDone ? '#c4b5fd' : '#a78bfa', fontWeight: isDone ? 700 : 400 }}>
        {isDone ? '✓ 100%' : `${Math.round(botProgress)}%`}
      </span>
    </div>
  );
}
