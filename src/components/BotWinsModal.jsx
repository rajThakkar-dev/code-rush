import { useEffect, useState } from 'react';
import { Bot, RefreshCw, Play, Zap } from 'lucide-react';

const BOT_WIN_ROASTS = [
  "A script beat you. A SCRIPT. It doesn't even have fingers.",
  "The bot finished before you. It also doesn't have a coffee addiction as an excuse.",
  "Congratulations! You lost to code that was written in 10 minutes. By me. With no effort.",
  "Bot wins. And it didn't even break a sweat. Mainly because it has no sweat glands.",
  "The bot typed faster than you. It's not even trying — it's just math.",
  "You got outrun by a for-loop. Let that sink in for a moment.",
  "The bot crossed the finish line. You're still somewhere in the middle, questioning your life choices.",
  "Speed: not your strong suit today. Maybe try interpretive dance instead?",
  "Even with no eyes, no hands, and no soul — the bot finished first. Respect.",
  "The machine won. Somewhere, a robot is doing a victory dance. You just can't see it.",
  "Bot: 1. Human dignity: 0. It's giving dystopia, honestly.",
  "Your WPM said 'hold on' and the bot said 'see ya'.",
  "You were so close… to starting. The bot? Already celebrating.",
  "The bot finished the race while you were still trying to warm up your fingers.",
  "SKILL ISSUE. (The bot authorized me to say that.)",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function BotWinsModal({ visible, botWpm, userWpm, onRetry, onNewSnippet }) {
  const [roast, setRoast] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setRoast(pick(BOT_WIN_ROASTS));
      // tiny delay so the flash animation can trigger first
      const t = setTimeout(() => setShow(true), 80);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Full-screen red flash */}
      <div className="bot-win-flash" />

      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      >
        <div className={`relative mx-auto max-w-lg w-full ${show ? 'bot-win-modal-in' : 'opacity-0'}`}>

          {/* Glowing border card */}
          <div
            className="rounded-2xl p-7 text-center"
            style={{
              border: '1px solid rgba(139,92,246,0.5)',
              background: 'linear-gradient(145deg, rgba(10,5,25,0.98), rgba(20,5,40,0.98))',
              boxShadow: '0 0 80px rgba(139,92,246,0.25), 0 0 0 1px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Pulsing bot icon */}
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full bot-win-pulse-ring"
                style={{ background: 'rgba(139,92,246,0.15)', border: '2px solid rgba(139,92,246,0.4)' }}
              />
              <div
                className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                  boxShadow: '0 0 32px rgba(139,92,246,0.6)',
                }}
              >
                <Bot size={30} color="white" />
              </div>
            </div>

            {/* Title */}
            <div
              className="mb-1 font-mono text-xs uppercase tracking-[0.3em]"
              style={{ color: '#a78bfa' }}
            >
              Race over
            </div>
            <h2
              className="mb-1 text-3xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #c4b5fd, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              BOT WINS 🤖
            </h2>

            {/* WPM comparison */}
            <div className="mx-auto mb-5 mt-4 flex max-w-xs items-center gap-3">
              <div
                className="flex-1 rounded-xl p-3"
                style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}
              >
                <div className="text-xs" style={{ color: '#c4b5fd' }}>Bot</div>
                <div className="text-xl font-bold font-mono" style={{ color: '#a78bfa' }}>
                  {Math.round(botWpm)} <span className="text-sm font-normal">WPM</span>
                </div>
              </div>
              <Zap size={18} style={{ color: '#6d28d9', flexShrink: 0 }} />
              <div
                className="flex-1 rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
              >
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>You</div>
                <div className="text-xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                  {Math.round(userWpm || 0)} <span className="text-sm font-normal">WPM</span>
                </div>
              </div>
            </div>

            {/* Roast */}
            <div
              className="mb-6 rounded-xl px-4 py-3 text-sm leading-relaxed"
              style={{
                background: 'rgba(139,92,246,0.07)',
                border: '1px solid rgba(139,92,246,0.15)',
                color: 'var(--text-primary)',
                fontStyle: 'italic',
              }}
            >
              "{roast}"
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={onRetry}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition"
                style={{
                  border: '1px solid rgba(139,92,246,0.35)',
                  background: 'rgba(139,92,246,0.1)',
                  color: '#c4b5fd',
                }}
              >
                <RefreshCw size={15} /> Rematch (same snippet)
              </button>
              <button
                onClick={onNewSnippet}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                  color: 'white',
                  boxShadow: '0 0 24px rgba(139,92,246,0.4)',
                }}
              >
                <Play size={15} fill="white" /> New snippet
              </button>
            </div>

            {/* Dismiss hint */}
            <p className="mt-4 text-xs" style={{ color: 'var(--text-subtle)' }}>
              Or keep typing — finish the snippet anyway for the moral victory.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
