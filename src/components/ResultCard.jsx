import { ArrowLeft, BarChart3, Code2, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatAccuracy, formatDuration, formatWpm, performanceMessage, performanceBadge } from '../utils/metrics';

export default function ResultCard({ result, onTryAgain, onNewSnippet }) {
  const badge = performanceBadge(result.wpm);

  return (
    <div className="panel overflow-hidden">

      {/* Hero result area */}
      <div className="relative overflow-hidden p-6 text-center sm:p-10">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at top, var(--accent-glow), transparent 55%)' }}
        />
        <div className="relative">
          {/* Badge / Icon */}
          <div
            className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl ring-1 text-3xl"
            style={{ background: 'var(--accent-glow)', ringColor: 'var(--tag-border)' }}
          >
            {badge.emoji}
          </div>

          {/* Rank label */}
          <div className="accent-badge mx-auto mb-3 w-fit">
            <span className={badge.color}>{badge.label}</span>
          </div>

          {/* WPM */}
          <p className="font-mono text-xs uppercase tracking-[.2em]" style={{ color: 'var(--accent)' }}>
            Race complete
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            {formatWpm(result.wpm)}{' '}
            <span className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>WPM</span>
          </h1>

          {/* Performance message */}
          <p className="mt-3 mx-auto max-w-sm text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
            {performanceMessage(result.wpm)}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {[
          ['Accuracy', formatAccuracy(result.accuracy)],
          ['Time', formatDuration(result.durationMs)],
          ['Errors', result.errors],
          ['Correct', result.correctCharacters],
        ].map(([label, value]) => (
          <div
            key={label}
            className="p-4 text-center"
            style={{ borderRight: '1px solid var(--border)' }}
          >
            <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>{label}</div>
            <div className="mt-1 font-mono text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Snippet details */}
      <div className="grid gap-3 p-5 text-sm sm:grid-cols-3">
        <div>
          <span style={{ color: 'var(--text-subtle)' }}>Language</span>
          <div className="mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>{result.languageName}</div>
        </div>
        <div>
          <span style={{ color: 'var(--text-subtle)' }}>Difficulty</span>
          <div className="mt-1 font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>{result.difficulty}</div>
        </div>
        <div>
          <span style={{ color: 'var(--text-subtle)' }}>Snippet</span>
          <div className="mt-1 font-semibold" style={{ color: 'var(--text-primary)' }}>
            {result.lineCount} lines &middot; {result.totalCharacters} chars
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex flex-col gap-2 p-5 sm:flex-row sm:flex-wrap"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <button className="btn-primary flex-1" onClick={onTryAgain}>
          <RotateCcw size={17} /> Try again (you can do better)
        </button>
        <button className="btn-secondary flex-1" onClick={onNewSnippet}>
          <Code2 size={17} /> New snippet
        </button>
        <Link to="/history" className="btn-secondary flex-1">
          <BarChart3 size={17} /> My shame history
        </Link>
        <Link to="/" className="btn-secondary">
          <ArrowLeft size={17} /> Home
        </Link>
      </div>

    </div>
  );
}
