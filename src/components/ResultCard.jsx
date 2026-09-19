import { ArrowLeft, BarChart3, Code2, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatAccuracy, formatDuration, formatWpm, performanceMessage } from '../utils/metrics';

export default function ResultCard({ result, onTryAgain, onNewSnippet }) {
  const accuracy = Math.round(result.accuracy);
  return <div className="panel overflow-hidden">
    <div className="relative overflow-hidden p-6 text-center sm:p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,.13),transparent_55%)]"/><div className="relative"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/20"><Sparkles size={26}/></div><p className="font-mono text-xs uppercase tracking-[.2em] text-cyan-300">Race complete</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{formatWpm(result.wpm)} <span className="text-lg font-medium text-slate-500">WPM</span></h1><p className="mt-2 text-slate-400">{performanceMessage(result.wpm)}</p></div></div>
    <div className="grid grid-cols-2 border-y border-white/[0.06] sm:grid-cols-4">
      {[['Accuracy',formatAccuracy(result.accuracy)],['Time',formatDuration(result.durationMs)],['Errors',result.errors],['Correct',result.correctCharacters]].map(([label,value])=><div key={label} className="border-r border-white/[0.06] p-4 text-center last:border-r-0"><div className="text-xs uppercase tracking-wider text-slate-600">{label}</div><div className="mt-1 font-mono text-xl font-semibold">{value}</div></div>)}
    </div>
    <div className="grid gap-3 p-5 text-sm sm:grid-cols-3"><div><span className="text-slate-600">Language</span><div className="mt-1 font-semibold">{result.languageName}</div></div><div><span className="text-slate-600">Difficulty</span><div className="mt-1 font-semibold capitalize">{result.difficulty}</div></div><div><span className="text-slate-600">Snippet</span><div className="mt-1 font-semibold">{result.lineCount} lines · {result.totalCharacters} chars</div></div></div>
    <div className="flex flex-col gap-2 border-t border-white/[0.06] p-5 sm:flex-row sm:flex-wrap"><button className="btn-primary flex-1" onClick={onTryAgain}><RotateCcw size={17}/> Try again</button><button className="btn-secondary flex-1" onClick={onNewSnippet}><Code2 size={17}/> New snippet</button><Link to="/history" className="btn-secondary flex-1"><BarChart3 size={17}/> View history</Link><Link to="/" className="btn-secondary"><ArrowLeft size={17}/> Home</Link></div>
  </div>;
}
