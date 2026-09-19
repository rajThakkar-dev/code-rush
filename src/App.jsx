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

export default function App(){
  const [settings,setSettingsState] = useState(()=>safeGet(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
  const languages = useMemo(()=>{ try{return normalizeLanguages(getLanguages());}catch{return [];} },[]);
  const setSettings = (updater) => setSettingsState(prev => typeof updater === 'function' ? updater(prev) : updater);
  useEffect(()=>{ safeSet(STORAGE_KEYS.settings, settings); document.documentElement.classList.toggle('reduced-motion', Boolean(settings.reducedMotion)); },[settings]);
  return <div className="min-h-screen bg-[#050a12] text-slate-100"><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/practice" element={<Practice settings={settings} setSettings={setSettings} />}/><Route path="/results" element={<Results/>}/><Route path="/history" element={<History/>}/><Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} languages={languages}/>}/><Route path="*" element={<Home/>}/></Routes></div>;
}
