import { generateRandomCode } from '@whitep4nth3r/random-code';

export const LENGTH_RANGES = {
  short: [3, 5],
  medium: [6, 10],
  long: [11, 20],
};

export function pickLineCount(length, difficulty) {
  const [min, max] = LENGTH_RANGES[length] || LENGTH_RANGES.medium;
  let floor = min;
  let ceiling = max;
  if (difficulty === 'easy') ceiling = Math.min(max, min + 2);
  if (difficulty === 'hard') floor = Math.max(min, Math.ceil((min + max) / 2));
  return Math.floor(Math.random() * (ceiling - floor + 1)) + floor;
}

export function normalizeLanguages(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((item) => {
      if (typeof item === 'string') return { key: item, name: item };
      return { key: item.key ?? item.languageKey ?? item.id ?? item.value, name: item.name ?? item.languageValue ?? item.label ?? item.value ?? item.key };
    }).filter((x) => x.key && x.name);
  }
  return Object.entries(raw).map(([key, name]) => ({ key, name: String(name) }));
}

export function generateSnippet(languageKey, snippetLength, difficulty) {
  if (!languageKey) throw new Error('Please select a programming language.');
  const lineCount = pickLineCount(snippetLength, difficulty);
  const result = generateRandomCode(languageKey, lineCount);
  const code = typeof result === 'string' ? result : result?.code;
  if (!code || typeof code !== 'string' || !code.length) throw new Error('The code generator returned an empty snippet.');
  return { code, lineCount: result?.lines ?? lineCount, languageKey: result?.languageKey ?? languageKey, languageName: result?.languageValue ?? languageKey };
}
