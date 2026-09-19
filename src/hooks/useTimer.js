import { useEffect, useRef, useState } from 'react';

export function useTimer(running, startedAt, stoppedAt) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!running || !startedAt) return undefined;
    const tick = () => {
      setElapsedMs(Math.max(0, (stoppedAt || performance.now()) - startedAt));
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, startedAt, stoppedAt]);
  useEffect(() => {
    if (!running && startedAt && stoppedAt) setElapsedMs(Math.max(0, stoppedAt - startedAt));
    if (!startedAt) setElapsedMs(0);
  }, [running, startedAt, stoppedAt]);
  return elapsedMs;
}
