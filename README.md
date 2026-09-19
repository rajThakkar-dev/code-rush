# CodeRush

CodeRush is a frontend-only developer typing-race app inspired by TypeRacer. Instead of prose, it generates random programming-code snippets and measures how quickly and accurately you can reproduce them.

## Stack

- React + Vite
- JavaScript
- Tailwind CSS
- `@whitep4nth3r/random-code`
- `lucide-react`
- Browser LocalStorage for settings, race history, and derived progress

There is **no backend, API server, database, authentication, API key, or deployment service**.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

For a production build:

```bash
npm run build
npm run preview
```

## Random-code integration

The app imports:

```js
import { getLanguages, generateRandomCode } from '@whitep4nth3r/random-code';
```

The package was verified against its source before integration. `getLanguages()` exposes an object whose language keys are different from several display names. The current keys include `css`, `cobol`, `csharp`, `docker`, `fsharp`, `go`, `php`, `java`, `js`, `ts`, `kotlin`, `perl`, `python`, `powershell`, `rust`, `swift`, `cplusplus`, `sql`, and `vba`. CodeRush consumes those returned keys rather than guessing them.

`generateRandomCode(languageKey, lineCount)` returns an object containing the generated `code`, `lines`, `languageKey`, and `languageValue`.

Difficulty is intentionally implemented in CodeRush rather than pretending the package supports difficulty: it changes the line-count selection within the requested short/medium/long range. The generator itself remains the source of snippets.

## Typing metrics

- **Accuracy:** `correct characters / total typed characters × 100`
- **Raw WPM:** `total typed characters / 5 / elapsed minutes`
- **Correct WPM:** `correct characters / 5 / elapsed minutes`
- **Errors:** typed characters that do not match the target character at the same position
- **Progress:** typed characters divided by target characters

The timer remains at `00:00` until the first non-empty keystroke and stops as soon as the target length is completed.

## Local data

The browser stores data under:

- `coderush_race_history`
- `coderush_settings`
- `coderush_user_stats` (reserved namespace for future derived stats)

Race results are saved locally. Nothing is sent to a server. If LocalStorage is unavailable, CodeRush falls back to in-memory state and remains usable for the current session.

## Accessibility

Controls have labels, keyboard focus states, semantic navigation, progress semantics, an accessible typing input, and a reduced-motion preference. Correctness is communicated with text/underline/background treatment in addition to color.

## Notes

- The code area preserves whitespace, indentation, line breaks, symbols, quotes, and backticks.
- No autocomplete or automatic bracket/quote completion is used.
- The typing input is intentionally visually transparent over the rendered target so each character can be styled independently while native keyboard input remains available.
- There are no network requests made by CodeRush itself during races.
