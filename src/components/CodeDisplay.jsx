import { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * Splits the target string into line arrays for gutter rendering.
 * Returns an array of { lineNumber, chars: [{char, globalIndex}] }
 */
function buildLines(target) {
  const lines = [];
  let current = { chars: [] };
  for (let i = 0; i < target.length; i++) {
    current.chars.push({ char: target[i], globalIndex: i });
    if (target[i] === '\n') {
      lines.push(current);
      current = { chars: [] };
    }
  }
  if (current.chars.length > 0) lines.push(current);
  return lines;
}

export default function CodeDisplay({ target, typed, inputRef, onChange, onFocus, disabled = false }) {
  const cursorLineRef = useRef(null);
  const containerRef = useRef(null);

  const lines = useMemo(() => buildLines(target), [target]);

  // Auto-scroll: keep the current cursor line visible inside the code panel
  useEffect(() => {
    if (cursorLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const el = cursorLineRef.current;
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      const viewTop = container.scrollTop;
      const viewBottom = viewTop + container.clientHeight;
      // Scroll only if cursor line is out of view (with a small buffer)
      if (elBottom > viewBottom - 32) {
        container.scrollTo({ top: elTop - container.clientHeight / 2, behavior: 'smooth' });
      } else if (elTop < viewTop + 32) {
        container.scrollTo({ top: elTop - 40, behavior: 'smooth' });
      }
    }
  }, [typed.length]);

  // Handle Tab key: insert spaces matching tab-size (2) instead of losing focus
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const TAB = '  '; // 2 spaces to match tab-size: 2
      // Find the next character in the target — if it's \t, consume it; otherwise insert spaces
      const pos = typed.length;
      if (target[pos] === '\t') {
        onChange(typed + '\t');
      } else {
        onChange(typed + TAB);
      }
    }
    // Handle Enter press — insert a newline if the target expects it
    if (e.key === 'Enter') {
      // Let textarea handle naturally — but ensure it doesn't create extra newlines
      // Textarea will fire onChange, which is fine
    }
  }, [typed, target, onChange]);

  // Find which line index the cursor is on
  const cursorLineIndex = useMemo(() => {
    const beforeCursor = target.slice(0, typed.length);
    const newlines = (beforeCursor.match(/\n/g) || []).length;
    return newlines;
  }, [target, typed.length]);

  return (
    <div className="cr-panel overflow-hidden">
      {/* Faux editor title bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-300/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>challenge.code</span>
        </div>
        <span className="font-mono text-[11px]" style={{ color: 'var(--text-subtle)' }}>exact match required</span>
      </div>

      {/* Code area */}
      <div
        ref={containerRef}
        className="relative overflow-auto code-scroll cr-code-area"
        onClick={onFocus}
        style={{ minHeight: '320px', maxHeight: '520px', background: 'var(--bg-base)' }}
      >
        {/* Line numbers + code characters */}
        <pre className="race-code pointer-events-none relative z-10 whitespace-pre p-0 text-slate-500 flex" aria-hidden="true">
          {/* Gutter of line numbers */}
          <div className="cr-gutter select-none">
            {lines.map((_, idx) => (
              <div
                key={idx}
                className={`cr-line-num${idx === cursorLineIndex ? ' cr-line-num-active' : ''}`}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Code characters */}
          <div className="cr-code-body flex-1">
            {lines.map((line, lineIdx) => {
              const isActiveLine = lineIdx === cursorLineIndex;
              return (
                <div
                  key={lineIdx}
                  ref={isActiveLine ? cursorLineRef : null}
                  className={`cr-code-line${isActiveLine ? ' cr-active-line' : ''}`}
                >
                  {line.chars.map(({ char, globalIndex }) => {
                    const typedChar = typed[globalIndex];
                    let cls = 'cr-char cr-char-untyped';
                    const isCursor = globalIndex === typed.length;

                    if (typedChar !== undefined) {
                      cls = typedChar === char ? 'cr-char cr-char-correct' : 'cr-char cr-char-incorrect';
                    }

                    if (isCursor) cls += ' cr-char-cursor';

                    if (char === '\n') {
                      return (
                        <span key={globalIndex} className={cls}>
                          {/* Show a faint ↵ symbol at newline position for the cursor, invisible otherwise */}
                          {isCursor ? <span className="cr-newline-hint">↵</span> : null}
                          {'\n'}
                        </span>
                      );
                    }

                    if (char === '\t') {
                      return (
                        <span key={globalIndex} className={cls}>
                          {'  '}
                        </span>
                      );
                    }

                    if (char === ' ') {
                      // Show a subtle middle-dot for spaces only when incorrectly typed
                      const isWrong = typedChar !== undefined && typedChar !== char;
                      return (
                        <span key={globalIndex} className={cls}>
                          {isWrong ? '·' : ' '}
                        </span>
                      );
                    }

                    return <span key={globalIndex} className={cls}>{char}</span>;
                  })}
                </div>
              );
            })}
          </div>
        </pre>

        {/* Invisible textarea for capturing input */}
        <textarea
          ref={inputRef}
          value={typed}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label="Type the displayed code exactly"
          className="race-input absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent p-5 font-mono text-sm leading-[1.7] text-transparent caret-transparent outline-none"
        />
      </div>

      {/* Legend bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
          Correct
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-rose-400 inline-block" />
          Incorrect
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="cr-legend-cursor" />
          Cursor
        </span>
        <span className="ml-auto font-mono text-slate-600">Tab = indent · Enter = newline</span>
      </div>
    </div>
  );
}
