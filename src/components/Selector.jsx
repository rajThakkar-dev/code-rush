import { ChevronDown } from 'lucide-react';

export function SelectField({ label, value, onChange, options, disabled = false, help }) {
  return <label className="block">
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
    <span className="relative block">
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="field appearance-none pr-10" aria-label={label}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
    </span>
    {help && <span className="mt-1.5 block text-xs text-slate-600">{help}</span>}
  </label>;
}

export function LanguageSelector({ languages, value, onChange }) {
  return <SelectField label="Language" value={value} onChange={onChange} options={languages.map(l => ({ value: l.key, label: l.name }))} />;
}
export function DifficultySelector({ value, onChange }) {
  return <SelectField label="Difficulty" value={value} onChange={onChange} options={[{value:'easy',label:'Easy'},{value:'medium',label:'Medium'},{value:'hard',label:'Hard'}]} />;
}
export function SnippetLengthSelector({ value, onChange }) {
  return <SelectField label="Snippet length" value={value} onChange={onChange} options={[{value:'short',label:'Short · 3–5 lines'},{value:'medium',label:'Medium · 6–10 lines'},{value:'long',label:'Long · 11–20 lines'}]} />;
}
