import { ChevronDown } from 'lucide-react';

export function SelectField({ label, value, onChange, options, disabled = false, help }) {
  return (
    <label className="block">
      <span
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="field appearance-none pr-10"
          aria-label={label}
          style={{
            background: 'var(--bg-base)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} style={{ background: 'var(--bg-panel)' }}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />
      </span>
      {help && <span className="mt-1.5 block text-xs" style={{ color: 'var(--text-subtle)' }}>{help}</span>}
    </label>
  );
}

export function LanguageSelector({ languages, value, onChange }) {
  return (
    <SelectField
      label="Language (your poison)"
      value={value}
      onChange={onChange}
      options={languages.map(l => ({ value: l.key, label: l.name }))}
    />
  );
}

export function DifficultySelector({ value, onChange }) {
  return (
    <SelectField
      label="Difficulty"
      value={value}
      onChange={onChange}
      options={[
        { value: 'easy', label: 'Easy · Training wheels on' },
        { value: 'medium', label: 'Medium · Feeling brave?' },
        { value: 'hard', label: 'Hard · Have you tried therapy?' },
      ]}
    />
  );
}

export function SnippetLengthSelector({ value, onChange }) {
  return (
    <SelectField
      label="Snippet length"
      value={value}
      onChange={onChange}
      options={[
        { value: 'short', label: 'Short · 3-5 lines (warm-up)' },
        { value: 'medium', label: 'Medium · 6-10 lines (solid)' },
        { value: 'long', label: 'Long · 11-20 lines (commitment)' },
      ]}
    />
  );
}
