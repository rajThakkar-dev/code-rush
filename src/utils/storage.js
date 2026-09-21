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
