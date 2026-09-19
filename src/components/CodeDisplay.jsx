import { useMemo } from 'react';

export default function CodeDisplay({ target, typed, inputRef, onChange, onFocus, disabled = false }) {
  const chars = useMemo(() => Array.from(target), [target]);
  return <div className="panel overflow-hidden">
    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
      <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400/80"/><span className="h-2.5 w-2.5 rounded-full bg-amber-300/80"/><span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80"/><span className="ml-2 font-mono text-xs text-slate-500">challenge.code</span></div>
      <span className="font-mono text-[11px] text-slate-600">exact match</span>
    </div>
    <div className="relative min-h-[300px] overflow-auto bg-[#060d17] code-scroll" onClick={onFocus}>
      <pre className="race-code pointer-events-none whitespace-pre-wrap break-words p-5 text-slate-500 sm:p-7" aria-hidden="true">{chars.map((char, i) => {
        const typedChar = typed[i];
        let cls = 'char-untyped';
        if (typedChar !== undefined) cls = typedChar === char ? 'char-correct' : 'char-incorrect';
        if (i === typed.length) cls += ' char-current';
        return <span key={`${i}-${char}`}>{char === ' ' ? <span className={cls}>&nbsp;</span> : char === '\t' ? <span className={cls}>&nbsp;&nbsp;</span> : char === '\n' ? <span className={cls}>{'\n'}</span> : <span className={cls}>{char}</span>}</span>;
      })}</pre>
      <textarea ref={inputRef} value={typed} onChange={(e)=>onChange(e.target.value)} onFocus={onFocus} disabled={disabled} spellCheck="false" autoCapitalize="off" autoCorrect="off" aria-label="Type the displayed code exactly" className="race-input absolute inset-0 h-full min-h-[300px] w-full resize-none overflow-auto bg-transparent p-5 font-mono text-sm leading-[1.7] text-transparent caret-cyan-300 outline-none selection:bg-cyan-400/10 sm:p-7" />
    </div>
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] px-4 py-3 text-xs text-slate-500">
      <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-400"/>Correct</span><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-rose-400"/>Incorrect</span><span><i className="mr-1 inline-block h-2 w-2 rounded-sm border border-cyan-300"/>Current</span><span className="ml-auto">Spaces & indentation matter</span>
    </div>
  </div>;
}
