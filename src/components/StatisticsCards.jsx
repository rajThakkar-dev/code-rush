import { Activity, Award, Code2, Flame, Target, Trophy } from 'lucide-react';
import { formatAccuracy, formatWpm } from '../utils/metrics';

export default function StatisticsCards({ history }) {
  const total = history.length;
  const bestWpm = history.reduce((m, r) => Math.max(m, Number(r.wpm) || 0), 0);
  const avgWpm = total ? history.reduce((s, r) => s + (Number(r.wpm) || 0), 0) / total : 0;
  const bestAccuracy = history.reduce((m, r) => Math.max(m, Number(r.accuracy) || 0), 0);
  const avgAccuracy = total ? history.reduce((s, r) => s + (Number(r.accuracy) || 0), 0) / total : 0;
  const counts = history.reduce((a, r) => {
    const lang = r.languageName || r.language || 'Unknown';
    a[lang] = (a[lang] || 0) + 1;
    return a;
  }, {});
  const language = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None yet';

  const items = [
    [Activity, 'Races run', total],
    [Trophy, 'Best WPM', formatWpm(bestWpm)],
    [Target, 'Avg WPM', formatWpm(avgWpm)],
    [Award, 'Best accuracy', formatAccuracy(bestAccuracy)],
    [Flame, 'Avg accuracy', formatAccuracy(avgAccuracy)],
    [Code2, 'Fav language', language],
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([Icon, label, value]) => (
        <div className="panel p-4" key={label}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            <Icon size={15} style={{ color: 'var(--accent)' }} />
            {label}
          </div>
          <div className="mt-2 truncate font-mono text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
