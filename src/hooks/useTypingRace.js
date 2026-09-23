import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { calculateMetrics } from '../utils/metrics';
import { createId, STORAGE_KEYS, safeGet, safeSet } from '../utils/storage';

const initialState = { target: '', typed: '', running: false, finished: false, startedAt: null, stoppedAt: null };

export function useTypingRace({ snippet, language, difficulty, lineCount, onFinish, instantDeath = false, frozenByBot = false }) {
  const [race, setRace] = useState({ ...initialState, target: snippet || '' });
  const [now, setNow] = useState(0);
  const [shaking, setShaking] = useState(false);
  // Capture the exact elapsed time the moment the bot wins so it doesn't keep growing
  const frozenElapsedRef = useRef(null);
  const [pasteBlocked, setPasteBlocked] = useState(false); // shows the roast modal
  const inputRef = useRef(null);
  const completedRef = useRef(false);
  const deathTimeoutRef = useRef(null);
  // Tracks accumulated paused time so elapsed is correct
  const pausedAccumRef = useRef(0);
  const pauseStartRef = useRef(null);

  useEffect(() => {
    setRace({ ...initialState, target: snippet || '' });
    completedRef.current = false;
    pausedAccumRef.current = 0;
    pauseStartRef.current = null;
    frozenElapsedRef.current = null;
  }, [snippet]);

  // Cleanup death timeout on unmount
  useEffect(() => () => clearTimeout(deathTimeoutRef.current), []);

  // Continuously tick while running, not paused, and not frozen by a bot win
  useEffect(() => {
    if (!race.running || pasteBlocked || frozenByBot) return undefined;
    const id = setInterval(() => setNow(performance.now()), 50);
    return () => clearInterval(id);
  }, [race.running, pasteBlocked, frozenByBot]);

  // When the bot wins, capture elapsedMs at that exact moment so it never grows
  useEffect(() => {
    if (frozenByBot && race.running && race.startedAt && frozenElapsedRef.current === null) {
      const totalPaused = pausedAccumRef.current + (pauseStartRef.current ? performance.now() - pauseStartRef.current : 0);
      frozenElapsedRef.current = Math.max(0, performance.now() - race.startedAt - totalPaused);
    }
    if (!frozenByBot) {
      frozenElapsedRef.current = null;
    }
  }, [frozenByBot, race.running, race.startedAt]);

  // Pause / resume accounting
  useEffect(() => {
    if (!race.running) return;
    if (pasteBlocked) {
      // Record when we paused
      if (pauseStartRef.current === null) {
        pauseStartRef.current = performance.now();
      }
    } else {
      // Resume: accumulate the paused duration
      if (pauseStartRef.current !== null) {
        pausedAccumRef.current += performance.now() - pauseStartRef.current;
        pauseStartRef.current = null;
      }
    }
  }, [pasteBlocked, race.running]);

  const elapsedMs = (() => {
    if (!race.startedAt) return 0;
    // If frozen by a bot win, return the captured snapshot so WPM doesn't decay
    if (frozenElapsedRef.current !== null) return frozenElapsedRef.current;
    const base = race.stoppedAt || now || performance.now();
    const totalPaused = pausedAccumRef.current + (pauseStartRef.current ? performance.now() - pauseStartRef.current : 0);
    return Math.max(0, base - race.startedAt - totalPaused);
  })();

  const metrics = useMemo(() => calculateMetrics(race.target, race.typed, elapsedMs), [race.target, race.typed, elapsedMs]);

  const finish = useCallback((finalRace) => {
    if (completedRef.current) return;
    completedRef.current = true;
    // Compute final elapsed excluding paused time
    const totalPaused = pausedAccumRef.current + (pauseStartRef.current ? performance.now() - pauseStartRef.current : 0);
    const finalElapsed = Math.max(0, (finalRace.stoppedAt || performance.now()) - finalRace.startedAt - totalPaused);
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

  // Handle paste: block it and show roast modal
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    setPasteBlocked(true);
  }, []);

  const closePasteModal = useCallback(() => {
    setPasteBlocked(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const handleChange = useCallback((value) => {
    if (completedRef.current) return;
    if (pasteBlocked) return; // ignore input while modal is open

    setRace((prev) => {
      if (prev.finished) return prev;

      const firstKeystroke = !prev.running && value.length > 0;
      const next = {
        ...prev,
        typed: value,
        running: firstKeystroke ? true : prev.running,
        startedAt: firstKeystroke ? performance.now() : prev.startedAt,
      };

      // Instant Death: if the last typed character is wrong, shake and reset
      if (instantDeath && value.length > 0) {
        const lastIdx = value.length - 1;
        if (value[lastIdx] !== prev.target[lastIdx]) {
          setShaking(true);
          clearTimeout(deathTimeoutRef.current);
          deathTimeoutRef.current = setTimeout(() => {
            setShaking(false);
            completedRef.current = false;
            setRace({ ...initialState, target: prev.target });
            requestAnimationFrame(() => inputRef.current?.focus());
          }, 400);
          return next;
        }
      }

      // Normal finish check
      if (next.target && value.length >= next.target.length) {
        const done = { ...next, typed: value.slice(0, next.target.length), running: false, finished: true, stoppedAt: performance.now() };
        queueMicrotask(() => finish(done));
        return done;
      }

      return next;
    });
  }, [finish, instantDeath, pasteBlocked]);

  const restart = useCallback(() => {
    clearTimeout(deathTimeoutRef.current);
    setShaking(false);
    setPasteBlocked(false);
    completedRef.current = false;
    pausedAccumRef.current = 0;
    pauseStartRef.current = null;
    setRace({ ...initialState, target: snippet || '' });
    inputRef.current?.focus();
  }, [snippet]);

  const focus = useCallback(() => inputRef.current?.focus(), []);

  return { race, metrics, elapsedMs, inputRef, handleChange, handlePaste, closePasteModal, pasteBlocked, restart, focus, shaking };
}
