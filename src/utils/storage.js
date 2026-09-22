export const STORAGE_KEYS = {
  history: 'coderush_race_history',
  settings: 'coderush_settings',
  stats: 'coderush_user_stats',
  theme: 'coderush_theme',
};

export const DEFAULT_SETTINGS = {
  language: '',
  difficulty: 'medium',
  snippetLength: 'medium',
  instantDeath: false,
  zenMode: false,
  vsBot: false,
};

export function safeGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function createId() {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
}

/**
 * Returns the average WPM from local history.
 * Falls back to a random number between min and max if no history exists.
 */
export function getUserAvgWpm(fallbackMin = 30, fallbackMax = 60) {
  try {
    const history = safeGet(STORAGE_KEYS.history, []);
    if (!Array.isArray(history) || history.length === 0) {
      return Math.floor(Math.random() * (fallbackMax - fallbackMin + 1)) + fallbackMin;
    }
    const valid = history.map(r => Number(r.wpm)).filter(v => Number.isFinite(v) && v > 0);
    if (valid.length === 0) {
      return Math.floor(Math.random() * (fallbackMax - fallbackMin + 1)) + fallbackMin;
    }
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  } catch {
    return Math.floor(Math.random() * (fallbackMax - fallbackMin + 1)) + fallbackMin;
  }
}

