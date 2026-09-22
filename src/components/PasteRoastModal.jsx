import { useEffect, useState } from 'react';
import { ClipboardX, RefreshCw } from 'lucide-react';

const ROASTS = [
  "Ctrl+V? Really? Even my grandma types her own code. She's 87 and uses a typewriter.",
  "Congratulations! You've discovered the 'I have no muscle memory' shortcut. Bold strategy.",
  "PASTE DETECTED. Deploying cringe shields. Your keyboard is disappointed in you.",
  "Bro tried to paste in a TYPING test. That's like hiring a taxi to win a marathon.",
  "Error 419: Too much audacity. Please manually type your way out of this shame.",
  "The paste attempt has been logged, reported, and shared in #dev-hall-of-shame.",
  "Nice try, cheater. The code gods have flagged your IP for manual review.",
  "You just pasted in CodeRush. Stack Overflow judges you. W3Schools judges you. I judge you.",
  "PASTE? In MY typing race? It's more likely than you'd think, apparently.",
  "Scientists confirm: copy-pasting here doesn't make you a 10x developer. It makes you a 0x developer.",
  "Your fingers called. They're filing a workers' comp claim for emotional abandonment.",
  "Interesting move. Most people cheat after they get bad. You came pre-loaded with bad.",
  "The keyboard felt a disturbance in the force. That was your dignity leaving.",
  "Plot twist: even the bot doesn't paste. The BOT, my dude.",
  "git blame shows paste attempt at line 1. The commit message is 'given up on life'.",
  "Your WPM is so scary you're pasting to avoid looking at it. Understandable, honestly.",
  "You just tried to copy-paste in a typing test. Touch some grass and come back.",
  "That paste attempt has been added to your permanent record. Future employers will know.",
  "Even ChatGPT types its own responses. Allegedly.",
  "Achievement unlocked: 🏆 'The Cheater's Shortcut' — Not actually an achievement.",
];

function getRandomRoast() {
  return ROASTS[Math.floor(Math.random() * ROASTS.length)];
}

/**
 * PasteRoastModal – shown when a user tries to paste during a race.
 * Props:
 *   visible  – whether to show the modal
 *   onClose  – callback to dismiss the modal
 */
export default function PasteRoastModal({ visible, onClose }) {
  const [roast, setRoast] = useState('');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setRoast(getRandomRoast());
      setAnimating(true);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className={`relative mx-auto max-w-md w-full rounded-2xl p-6 ${animating ? 'paste-modal-in' : ''}`}
        style={{
          border: '1px solid rgba(251,113,133,0.3)',
          background: 'linear-gradient(135deg, rgba(10,18,32,0.98), rgba(30,10,20,0.98))',
          boxShadow: '0 0 60px rgba(251,113,133,0.15), 0 0 0 1px rgba(251,113,133,0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)' }}
        >
          <ClipboardX size={28} style={{ color: '#fda4af' }} />
        </div>

        {/* Title */}
        <h2
          className="mb-1 text-center text-xl font-bold"
          style={{ color: '#fda4af' }}
        >
          Nice try, cheater 🚫
        </h2>
        <p
          className="mb-4 text-center text-xs font-mono uppercase tracking-widest"
          style={{ color: 'rgba(251,113,133,0.5)' }}
        >
          Paste intercepted · Timer paused
        </p>

        {/* Roast text */}
        <div
          className="mb-5 rounded-xl p-4 text-sm leading-relaxed"
          style={{
            background: 'rgba(251,113,133,0.05)',
            border: '1px solid rgba(251,113,133,0.1)',
            color: 'var(--text-primary)',
            fontStyle: 'italic',
          }}
        >
          "{roast}"
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className="flex-1 btn-secondary py-2.5 text-sm"
            onClick={() => setRoast(getRandomRoast())}
            style={{ borderColor: 'rgba(251,113,133,0.2)' }}
          >
            <RefreshCw size={14} />
            Another one
          </button>
          <button
            className="flex-1 btn-primary py-2.5 text-sm"
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #fda4af, #fb7185)',
              color: '#1a0a0a',
              boxShadow: '0 0 20px rgba(251,113,133,0.3)',
            }}
          >
            I'll type it myself 😤
          </button>
        </div>

        {/* Timer note */}
        <p
          className="mt-3 text-center text-xs"
          style={{ color: 'var(--text-subtle)' }}
        >
          ⏸ Timer is paused. Resume by closing this.
        </p>
      </div>
    </div>
  );
}
