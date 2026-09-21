import { ArrowRight, BarChart3, Code2, Gauge, History, Languages, ShieldCheck, Sparkles, Timer, Zap, Bug, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  [Coffee, 'No fluff. Just code.', 'Fresh code snippets generated locally. No "Hello World" nonsense. Real code, real pain, real improvement.'],
  [Languages, 'Pick your poison', 'JavaScript, Python, Rust, Go... Choose the language keeping you employed or the one you lied about on your CV.'],
  [Gauge, 'Brutally honest stats', 'WPM, accuracy, errors. We will tell you exactly how fast you type. Your ego might need a moment.'],
  [History, 'Your shame, saved locally', 'Race history lives in your browser. No account, no cloud, no recruiter ever seeing this. Promise.'],
];

const steps = [
  ['01', 'Pick your weapon', 'Language, length, difficulty. Choose wisely. Or recklessly. We do not judge.'],
  ['02', 'Type like it matters', 'Every character, space, and semicolon counts. Yes, including that trailing comma you always forget.'],
  ['03', 'Face the truth', 'WPM, accuracy, a roast. Then do it again until the shame turns into skill.'],
];

const roasts = [
  { wpm: '< 30 WPM', verdict: 'Rubber Duck Mode', desc: 'Your duck types faster. Seek help.' },
  { wpm: '30-60 WPM', verdict: 'Stack Overflow Speedrun', desc: "Copying code faster than you can type it." },
  { wpm: '60-100 WPM', verdict: '10x Developer Territory', desc: 'Your commits are starting to fear you.' },
  { wpm: '100+ WPM', verdict: 'AI-Level Threat', desc: 'GitHub Copilot sends its regards. And a resignation letter.' },
];

export default function Home() {
  return (
    <div className="coderush-grid relative overflow-hidden">
      {/* Hero glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse, var(--accent-glow), transparent 65%)' }}
      />

      <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">

        {/* Hero */}
        <section className="max-w-4xl">
          <div className="accent-badge mb-6">
            <span className="pulse-dot" />
            100% local. No accounts. No telemetry. No vibes-based pricing.
          </div>

          <h1 className="text-5xl font-extrabold tracking-[-0.04em] sm:text-7xl" style={{ color: 'var(--text-primary)' }}>
            Stop hunting<br />
            <span
              className="font-extrabold"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              for your keys.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 sm:text-lg" style={{ color: 'var(--text-muted)' }}>
            CodeRush is the typing trainer that does not care about your feelings.
            It gives you real code, times you mercilessly, and then shows you the receipts.
            Perfect for devs who want to type fast enough to outrun their technical debt.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/practice" className="btn-primary">
              Start the torture <ArrowRight size={18} />
            </Link>
            <Link to="/history" className="btn-secondary">
              See my shame <BarChart3 size={18} />
            </Link>
          </div>

          {/* Social proof of pain */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Zap size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-xs">Instant snippet generation</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Bug size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-xs">Real code, not lorem ipsum</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-xs">No account required (we are not that kind of startup)</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(([Icon, title, copy]) => (
            <div className="panel p-5 group hover:scale-[1.02] transition-transform" key={title}>
              <div
                className="grid h-10 w-10 place-items-center rounded-xl transition"
                style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}
              >
                <Icon size={19} />
              </div>
              <h3 className="mt-5 font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{copy}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="mt-16 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <div className="panel overflow-hidden p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[.18em]" style={{ color: 'var(--text-subtle)' }}>
              <Code2 size={15} />How this works (it's not rocket science. but close.)
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {steps.map(([num, title, copy]) => (
                <div key={num}>
                  <div className="font-mono text-xs" style={{ color: 'var(--accent)' }}>{num}</div>
                  <h3 className="mt-2 font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                  <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[.18em]" style={{ color: 'var(--text-subtle)' }}>
              <ShieldCheck size={15} />Privacy, actually
            </div>
            <h3 className="mt-5 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              We do not spy on you.
            </h3>
            <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
              All snippets are generated right here in your browser.
              Your scores stay in LocalStorage. No servers, no analytics, no cookie banners because we genuinely have no cookies to give you.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-subtle)' }}>
              <span className="inline-flex items-center gap-1.5"><Timer size={14} /> Live metrics</span>
              <span className="inline-flex items-center gap-1.5"><Code2 size={14} /> Real code only</span>
            </div>
          </div>
        </section>

        {/* WPM Roast Table */}
        <section className="mt-16">
          <div className="panel p-6 sm:p-8">
            <div className="mb-6">
              <div className="font-mono text-xs uppercase tracking-[.18em]" style={{ color: 'var(--accent)' }}>
                Completely objective classification
              </div>
              <h2 className="mt-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                What your WPM says about your soul
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                A scientific and totally unbiased assessment of your typing speed and moral character as a developer.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {roasts.map(({ wpm, verdict, desc }) => (
                <div
                  key={wpm}
                  className="rounded-xl p-4 transition hover:scale-[1.02]"
                  style={{ border: '1px solid var(--border)', background: 'var(--accent-glow)' }}
                >
                  <div className="font-mono text-xs font-bold" style={{ color: 'var(--accent)' }}>{wpm}</div>
                  <div className="mt-2 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{verdict}</div>
                  <div className="mt-1 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <div
            className="panel relative overflow-hidden p-10"
            style={{ background: 'radial-gradient(ellipse at top, var(--accent-glow), transparent 70%)' }}
          >
            <Sparkles size={32} className="mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Your fingers are bored.
            </h2>
            <p className="mt-3 text-base max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
              They have been writing the same 5 lines of code for months.
              Give them a challenge. They deserve it. You deserve it.
              Start typing.
            </p>
            <Link to="/practice" className="btn-primary mt-6 inline-flex">
              Let's go <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
