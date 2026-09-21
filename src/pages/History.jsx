import { ArrowLeft, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StatisticsCards from '../components/StatisticsCards';
import HistoryTable from '../components/HistoryTable';
import ConfirmationModal from '../components/ConfirmationModal';
import { STORAGE_KEYS, safeGet, safeRemove, safeSet } from '../utils/storage';

export default function History() {
  const [history, setHistory] = useState([]);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const h = safeGet(STORAGE_KEYS.history, []);
    setHistory(Array.isArray(h) ? h : []);
  }, []);

  function clear() {
    safeRemove(STORAGE_KEYS.history);
    safeSet(STORAGE_KEYS.stats, { totalCompletedRaces: 0, bestWpm: 0, bestAccuracy: 0 });
    setHistory([]);
    setConfirm(false);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm transition hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={16} /> Home
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 size={20} style={{ color: 'var(--accent)' }} />
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Your hall of shame
            </h1>
          </div>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Local-only race history. No server. No judgment. Well, a little judgment.
          </p>
        </div>
        <Link to="/practice" className="btn-primary hidden sm:inline-flex">
          Race again
        </Link>
      </div>

      <StatisticsCards history={history} />
      <div className="mt-5">
        <HistoryTable history={history} onClear={() => setConfirm(true)} />
      </div>

      <ConfirmationModal
        open={confirm}
        title="Nuke your race history?"
        message="This wipes all race results from this browser. Your settings survive. The shame does not."
        onCancel={() => setConfirm(false)}
        onConfirm={clear}
      />
    </main>
  );
}
