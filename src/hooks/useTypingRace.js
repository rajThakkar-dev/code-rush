import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { calculateMetrics } from '../utils/metrics';
import { createId, STORAGE_KEYS, safeGet, safeSet } from '../utils/storage';

const initialState = { target: '', typed: '', running: false, finished: false, startedAt: null, stoppedAt: null };

export function useTypingRace({ snippet, language, difficulty, lineCount, onFinish }) {
  const [race, setRace] = useState({ ...initialState, target: snippet || '' });
  const [now, setNow] = useState(0);
  const inputRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    setRace({ ...initialState, target: snippet || '' });
    completedRef.current = false;
  }, [snippet]);

  useEffect(() => {
    if (!race.running) return undefined;
    const id = setInterval(() => setNow(performance.now()), 50);
    return () => clearInterval(id);
  }, [race.running]);

  const elapsedMs = race.startedAt ? Math.max(0, (race.stoppedAt || now || performance.now()) - race.startedAt) : 0;
  const metrics = useMemo(() => calculateMetrics(race.target, race.typed, elapsedMs), [race.target, race.typed, elapsedMs]);

  const finish = useCallback((finalRace) => {
    if (completedRef.current) return;
    completedRef.current = true;
    const finalElapsed = Math.max(0, (finalRace.stoppedAt || performance.now()) - finalRace.startedAt);
    const finalMetrics = calculateMetrics(finalRace.target, finalRace.typed, finalElapsed);
    const result = {
      id: createId(), date: new Date().toISOString(), language: language?.key || '', languageName: language?.name || '', difficulty, lineCount,
      wpm: finalMetrics.wpm, rawWpm: finalMetrics.rawWpm, accuracy: finalMetrics.accuracy, errors: finalMetrics.errors,
      correctCharacters: finalMetrics.correctCharacters, totalCharacters: finalMetrics.totalCharacters, durationMs: finalElapsed,
    };
    const history = safeGet(STORAGE_KEYS.history, []);
    const nextHistory = [result, ...(Array.isArray(history) ? history : [])].slice(0, 100);
    safeSet(STORAGE_KEYS.history, nextHistory);
    const totalCompletedRaces = nextHistory.length;
    const bestWpm = nextHistory.reduce((max, item) => Math.max(max, Number(item.wpm) || 0), 0);
    const bestAccuracy = nextHistory.reduce((max, item) => Math.max(max, Number(item.accuracy) || 0), 0);
    safeSet(STORAGE_KEYS.stats, { totalCompletedRaces, bestWpm, bestAccuracy });
    onFinish?.(result);
  }, [difficulty, language, lineCount, onFinish]);

  const handleChange = useCallback((value) => {
    if (completedRef.current) return;
    setRace((prev) => {
      if (prev.finished) return prev;
      const firstKeystroke = !prev.running && value.length > 0;
      const next = { ...prev, typed: value, running: firstKeystroke ? true : prev.running, startedAt: firstKeystroke ? performance.now() : prev.startedAt };
      if (next.target && value.length >= next.target.length) {
        const done = { ...next, typed: value.slice(0, next.target.length), running: false, finished: true, stoppedAt: performance.now() };
        queueMicrotask(() => finish(done));
        return done;
      }
      return next;
    });
  }, [finish]);

  const restart = useCallback(() => {
    completedRef.current = false;
    setRace({ ...initialState, target: snippet || '' });
    inputRef.current?.focus();
  }, [snippet]);

  const focus = useCallback(() => inputRef.current?.focus(), []);

  return { race, metrics, elapsedMs, inputRef, handleChange, restart, focus };
}
