export function calculateMetrics(target, typed, elapsedMs) {
  const totalCharacters = target.length;
  const typedCharacters = typed.length;
  let correctCharacters = 0;
  const compareLength = Math.min(typedCharacters, totalCharacters);
  for (let i = 0; i < compareLength; i += 1) {
    if (typed[i] === target[i]) correctCharacters += 1;
  }
  const errors = Math.max(0, typedCharacters - correctCharacters);
  const accuracy = typedCharacters === 0 ? 100 : Math.min(100, (correctCharacters / typedCharacters) * 100);
  const elapsedMinutes = Math.max(elapsedMs, 1) / 60000;
  const rawWpm = typedCharacters === 0 ? 0 : (typedCharacters / 5) / elapsedMinutes;
  const wpm = correctCharacters === 0 ? 0 : (correctCharacters / 5) / elapsedMinutes;
  const progress = totalCharacters === 0 ? 0 : Math.min(100, (typedCharacters / totalCharacters) * 100);
  return { correctCharacters, totalCharacters, typedCharacters, errors, accuracy, rawWpm, wpm, progress };
}

export function formatWpm(value) { return Number.isFinite(value) ? Math.round(value) : 0; }
export function formatAccuracy(value) { return `${Number.isFinite(value) ? value.toFixed(1) : '0.0'}%`; }
export function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const tenths = Math.floor((ms % 1000) / 100);
  return `${minutes}:${seconds}.${tenths}`;
}

export function performanceMessage(wpm) {
  if (wpm < 20) return 'Even your rubber duck types faster. Keep going!';
  if (wpm < 35) return 'You type like you are reading the docs for the first time. Respect.';
  if (wpm < 50) return 'Stack Overflow was loading faster than you type. Almost there!';
  if (wpm < 65) return 'Solid. You can definitely survive a live coding interview... probably.';
  if (wpm < 80) return 'Impressive! You type faster than most PRs get reviewed.';
  if (wpm < 100) return 'You are in "senior dev who skipped the coffee" territory. Respect.';
  if (wpm < 120) return 'Are you a 10x developer? Because this is 10x speed. Certified typing menace.';
  if (wpm < 150) return 'GitHub Copilot is scared. You are basically AI at this point.';
  return 'SKYNET HAS ENTERED THE CHAT. You are no longer human. We accept our new overlord.';
}

export function performanceBadge(wpm) {
  if (wpm < 20) return { label: 'Rubber Duck', emoji: '🦆', color: 'text-slate-400' };
  if (wpm < 35) return { label: 'Junior Dev', emoji: '🐣', color: 'text-yellow-400' };
  if (wpm < 50) return { label: 'Mid-level', emoji: '☕', color: 'text-amber-400' };
  if (wpm < 65) return { label: 'Senior Dev', emoji: '🧠', color: 'text-blue-400' };
  if (wpm < 80) return { label: 'PR Destroyer', emoji: '💥', color: 'text-orange-400' };
  if (wpm < 100) return { label: '10x Dev', emoji: '🚀', color: 'text-purple-400' };
  if (wpm < 120) return { label: 'Keyboard Ninja', emoji: '⚔️', color: 'text-pink-400' };
  if (wpm < 150) return { label: 'AI Competitor', emoji: '🤖', color: 'text-cyan-400' };
  return { label: 'SKYNET', emoji: '👾', color: 'text-red-400' };
}
