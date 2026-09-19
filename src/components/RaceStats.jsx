import { Activity, Clock3, Crosshair, Gauge, Percent, RotateCcw } from 'lucide-react';
import { formatAccuracy, formatDuration, formatWpm } from '../utils/metrics';

function Stat({ icon: Icon, label, value }) { return <div className="glass rounded-xl px-3 py-2.5"><div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500"><Icon size={13}/>{label}</div><div className="mt-1 font-mono text-lg font-semibold text-slate-100">{value}</div></div>; }
export default function RaceStats({ metrics, elapsedMs, onRestart, progress }) {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
    <Stat icon={Gauge} label="WPM" value={formatWpm(metrics.wpm)} />
    <Stat icon={Activity} label="Raw" value={formatWpm(metrics.rawWpm)} />
    <Stat icon={Percent} label="Accuracy" value={formatAccuracy(metrics.accuracy)} />
    <Stat icon={Crosshair} label="Errors" value={metrics.errors} />
    <Stat icon={Clock3} label="Timer" value={formatDuration(elapsedMs)} />
    <button onClick={onRestart} className="glass flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white" aria-label="Restart race"><RotateCcw size={16}/> Restart</button>
    <div className="col-span-full mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]" aria-label={`Progress ${Math.round(progress)} percent`} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-[width] duration-150" style={{width:`${progress}%`}} /></div>
  </div>;
}
