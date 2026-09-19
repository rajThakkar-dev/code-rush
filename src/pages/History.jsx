import { useEffect, useState } from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatisticsCards from '../components/StatisticsCards';
import HistoryTable from '../components/HistoryTable';
import ConfirmationModal from '../components/ConfirmationModal';
import { STORAGE_KEYS, safeGet, safeRemove, safeSet } from '../utils/storage';

export default function History() {
  const [history, setHistory] = useState([]);
  const [confirm, setConfirm] = useState(false);
  useEffect(()=>{ const h=safeGet(STORAGE_KEYS.history,[]); setHistory(Array.isArray(h)?h:[]); },[]);
  function clear(){ safeRemove(STORAGE_KEYS.history); safeSet(STORAGE_KEYS.stats, { totalCompletedRaces: 0, bestWpm: 0, bestAccuracy: 0 }); setHistory([]); setConfirm(false); }
  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12"><div className="mb-8 flex items-end justify-between gap-4"><div><Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"><ArrowLeft size={16}/> Home</Link><div className="flex items-center gap-2"><BarChart3 size={20} className="text-cyan-300"/><h1 className="text-3xl font-bold">Local statistics</h1></div><p className="mt-2 text-sm text-slate-500">Your browser-only race history. Nothing is sent to a server.</p></div><Link to="/practice" className="btn-primary hidden sm:inline-flex">Practice</Link></div><StatisticsCards history={history}/><div className="mt-5"><HistoryTable history={history} onClear={()=>setConfirm(true)}/></div><ConfirmationModal open={confirm} title="Clear all race history?" message="This permanently removes the race results stored in this browser. Your settings will not be affected." onCancel={()=>setConfirm(false)} onConfirm={clear}/></main>;
}
