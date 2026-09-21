import { Trash2 } from 'lucide-react';
import { formatDuration, formatWpm } from '../utils/metrics';

export default function HistoryTable({ history, onClear }) {
  if (!history.length) return (
    <div className="panel p-10 text-center">
      <div
        className="mx-auto grid h-12 w-12 place-items-center rounded-2xl text-2xl"
        style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}
      >
        ⌁
      </div>
      <h3 className="mt-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        No races yet. What are you waiting for?
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-sm" style={{ color: 'var(--text-muted)' }}>
        Complete your first CodeRush race and your local history will appear here.
        The journey of a thousand WPM starts with a single keystroke.
      </p>
    </div>
  );

  return (
    <div className="panel overflow-hidden">
      <div
        className="flex items-center justify-between p-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent races</h3>
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>Stored only in this browser. Safe from your boss.</p>
        </div>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition"
          style={{ color: '#fda4af' }}
          aria-label="Clear race history"
        >
          <Trash2 size={15} /> Clear history
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
            <tr>
              {['Date', 'Language', 'WPM', 'Accuracy', 'Errors', 'Duration', 'Difficulty'].map(h => (
                <th
                  key={h}
                  className="px-4 py-3 font-medium text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map(r => (
              <tr
                key={r.id}
                className="transition"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{new Date(r.date).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{r.languageName || r.language}</td>
                <td className="px-4 py-3 font-mono font-semibold" style={{ color: 'var(--accent)' }}>{formatWpm(r.wpm)}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{Number(r.accuracy).toFixed(1)}%</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{r.errors}</td>
                <td className="px-4 py-3 font-mono" style={{ color: 'var(--text-primary)' }}>{formatDuration(r.durationMs)}</td>
                <td className="px-4 py-3 capitalize" style={{ color: 'var(--text-muted)' }}>{r.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
