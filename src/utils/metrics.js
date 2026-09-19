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
  if (wpm < 30) return 'Keep practicing.';
  if (wpm < 50) return 'Good foundation.';
  if (wpm < 70) return 'Great speed.';
  return 'Excellent developer speed.';
}
