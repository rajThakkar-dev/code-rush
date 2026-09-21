import { Activity, Clock3, Crosshair, Gauge, Percent, RotateCcw } from 'lucide-react';
import { formatAccuracy, formatDuration, formatWpm } from '../utils/metrics';

function Stat({ icon: Icon, label, value }) {
  return (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{ border: '1px solid var(--border)', background: 'var(--accent-glow)' }}
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        <Icon size={13} style={{ color: 'var(--accent)' }} />
        {label}
      </div>
      <div className="mt-1 font-mono text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

export default function RaceStats({ metrics, elapsedMs, onRestart, progress }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      <Stat icon={Gauge} label="WPM" value={formatWpm(metrics.wpm)} />
      <Stat icon={Activity} label="Raw" value={formatWpm(metrics.rawWpm)} />
      <Stat icon={Percent} label="Accuracy" value={formatAccuracy(metrics.accuracy)} />
      <Stat icon={Crosshair} label="Errors" value={metrics.errors} />
      <Stat icon={Clock3} label="Timer" value={formatDuration(elapsedMs)} />
      <button
        onClick={onRestart}
        className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition"
        style={{ border: '1px solid var(--border)', background: 'var(--accent-glow)', color: 'var(--text-primary)' }}
        aria-label="Restart race"
      >
        <RotateCcw size={16} /> Restart
      </button>
      <div
        className="col-span-full mt-1 h-1.5 overflow-hidden rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        aria-label={`Progress ${Math.round(progress)} percent`}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full transition-[width] duration-150"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
          }}
        />
      </div>
    </div>
  );
}
