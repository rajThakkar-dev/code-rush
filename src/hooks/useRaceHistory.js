import { useCallback } from 'react';
import { STORAGE_KEYS, safeGet, safeRemove, safeSet } from '../utils/storage';

export function useRaceHistory() {
  const getHistory = useCallback(() => {
    const data = safeGet(STORAGE_KEYS.history, []);
    return Array.isArray(data) ? data : [];
  }, []);
  const addResult = useCallback((result) => {
    const next = [result, ...getHistory()].slice(0, 100);
    safeSet(STORAGE_KEYS.history, next);
    return next;
  }, [getHistory]);
  const clearHistory = useCallback(() => safeRemove(STORAGE_KEYS.history), []);
  return { getHistory, addResult, clearHistory };
}
