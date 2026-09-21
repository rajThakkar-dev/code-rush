import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getLanguages } from '@whitep4nth3r/random-code';
import Header from './components/Header';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Results from './pages/Results';
import History from './pages/History';
import Settings from './pages/Settings';
import { DEFAULT_SETTINGS, STORAGE_KEYS, safeGet, safeSet } from './utils/storage';
import { normalizeLanguages } from './utils/snippet';
import { applyTheme } from './utils/themes';

export default function App(){
  const [settings, setSettingsState] = useState(() => safeGet(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
  const [theme, setThemeState] = useState(() => safeGet(STORAGE_KEYS.theme, 'neon'));
  const languages = useMemo(() => { try { return normalizeLanguages(getLanguages()); } catch { return []; } }, []);

  const setSettings = (updater) => setSettingsState(prev => typeof updater === 'function' ? updater(prev) : updater);

  const setTheme = (themeId) => {
    setThemeState(themeId);
    safeSet(STORAGE_KEYS.theme, themeId);
    applyTheme(themeId);
  };

  useEffect(() => {
    safeSet(STORAGE_KEYS.settings, settings);
  }, [settings]);

  useEffect(() => {
    applyTheme(theme);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <Header theme={theme} setTheme={setTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice settings={settings} setSettings={setSettings} />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} languages={languages} />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
