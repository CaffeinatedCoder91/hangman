# Handoff: Hangman Arcade Game

## Overview
A single-page Hangman word-guessing game with a playful arcade-retro visual style (light theme, vibrant accents, pixel display font). Covers five distinct states: Loading, Playing, Won, Lost, and Error.

## About the Design Files
The bundled file (`Hangman.dc.html`) is a **design reference prototype** built in HTML — it demonstrates the intended look, layout, and interaction behavior, not production code to copy directly. The task is to **recreate this design in the target codebase's environment** (per the project brief: React + styled-components), using the app's existing patterns/libraries. If no environment exists yet, React + styled-components is the intended stack (per original request).

## Fidelity
**High-fidelity.** Colors, typography, spacing, and states shown are final — implement pixel-close using the values below.

## Screens / Views
Single page, five states of the same view (no navigation between separate screens).

### 1. Loading
- Two skeleton panels (same grid as Playing) with pulsing placeholder bars (`opacity 0.35 <-> 0.7`, 1.4s ease-in-out infinite loop).
- Caption below: "LOADING WORD..." (13px, secondary text color).
- Triggered on initial mount and whenever "New Game" / "Retry" is pressed; simulated 700ms delay before resolving to Playing or Error.

### 2. Playing (default/happy path)
- **Header**: Title "HANGMAN" (Press Start 2P, clamp(26px,6vw,42px), purple, 2px letter-spacing, 3px hard drop-shadow in yellow), subtitle below (13px, secondary text).
- **Two-column grid** (`grid-template-columns: repeat(auto-fit, minmax(280px,1fr))`, gap 24px, `align-items: stretch` so both panels match height):
  - **Left panel** ("Drawing panel"): white card, 3px border, 8px radius, hard offset shadow (6px 6px 0, 12% black). Contains:
    - SVG hangman drawing, viewBox `0 0 200 220`, max-width 220px.
    - "ATTEMPTS: N/6" label (Press Start 2P, clamp(14px,3vw,18px), color shifts cyan→yellow→magenta as attempts drop — see Design Tokens).
    - "MISSED LETTERS" label (11px caption) + wrapping row of letter chips (28px square-ish, 2px border, light-red background, dark-red text).
  - **Right panel** ("Game panel"): same card styling. Contains:
    - Category badge (purple pill, white Press Start 2P 11px text) + hint text (13px, secondary color; hint text is replaced with "Hint unlocks after 2 wrong guesses..." until the 2nd miss, when `hintTiming` prop is `after-2-misses`).
    - Masked word: row of letter "slots", each `clamp(26px,7vw,42px)` wide × `clamp(34px,9vw,48px)` tall, flex centered, bottom border 4px, letter shown in Press Start 2P `clamp(16px,4vw,24px)` when guessed.
    - A11y: masked word visual row is `aria-hidden`; a visually-hidden sibling span holds the same info as text ("Word: R, blank, T, blank...") for screen readers.
    - On-screen A–Z keyboard: CSS grid `repeat(auto-fill, minmax(38px,1fr))`, gap 8px, each key is a real `<button>` 44px tall (meets touch-target minimum), disabled + dimmed/struck-through once guessed wrong, filled cyan + dark text once guessed correct.
    - "NEW GAME" button: pixel font, cyan background, dark-on-cyan text won't apply — text is white, 4px hard shadow, press-down active state (`translate(3px,3px)`, shadow removed).

### 3. Won
- Same layout as Playing, plus a banner above the masked word: solid yellow background, dark text, title "YOU WIN! ★" (Press Start 2P) + subtitle "Solved it: WORD". Banner animates in with a quick 0.3s pop/scale-in (`popIn` keyframe), no confetti.
- All word slots shown filled, colored cyan (border + text) to read as "correctly solved."

### 4. Lost
- Same layout, banner is solid orange/red background, dark text, title "GAME OVER" + subtitle "The word was: WORD".
- Word slots: letters the player actually guessed appear in normal ink; letters never guessed are revealed in the magenta/red accent color to visually distinguish "revealed because you lost" from "you got this one."

### 5. Error
- Replaces the two-column grid entirely with a single centered card: small triangle "!" warning glyph (CSS border-triangle, no SVG), title "CONNECTION LOST" (Press Start 2P, red), body copy "Couldn't fetch a new word from the server. Check your connection and try again.", and a "RETRY" button (yellow, same hard-shadow press style as New Game) that re-triggers the load sequence.

### Dev-only Preview Switcher
A small pill row under the subtitle ("Loading / Playing / Won / Lost / Error") lets a reviewer force-preview any state without playing the game. This is a **design/demo affordance only** — omit it from production, or keep behind a debug flag if useful for QA.

## Interactions & Behavior
- Clicking/tapping a letter button, or pressing the corresponding physical key, submits a guess (only while state is Playing).
- Correct guess: letter fills into its slot(s) in the masked word; button turns filled-cyan and becomes disabled.
- Incorrect guess: letter added to "missed letters" row; one more part of the hangman drawing is revealed; attempts-remaining count decrements; button becomes dimmed/struck-through and disabled.
- Hangman drawing has a static gallows (base, pole, beam, support brace — always fully drawn, dark gray) plus 6 progressive parts revealed one at a time on each wrong guess, in this order: rope, head, torso, arms (both arms as one step), legs (both legs as one step). Undrawn parts are shown as a faint "ghost" outline at all times (60% dimmed neutral gray) — a nice touch signalling how many stages remain.
- Word fully revealed via correct guesses → Won. 6th wrong guess → Lost.
- "New Game" always available (from Playing/Won/Lost); re-runs the Loading sequence and picks a new random word/category/hint, resetting guesses/misses.
- Screen-reader announcements: a visually-hidden `role="status" aria-live="polite"` region receives a text update on every guess ("Correct! E is in the word." / "Wrong. Z is not in the word. 3 attempts left." / "You won! The word was PYTHON." / "Out of attempts. The word was PYTHON." / "New game started. Category: ARCADE").
- Keyboard nav: every button (letters, New Game, Retry, preview switcher) is a native `<button>` with a visible focus ring (3px solid purple, 2–3px offset) — works with Tab/Enter/Space out of the box.
- Physical keyboard: letter keys (A–Z) trigger the same guess logic as clicking the on-screen key, while Playing.

## State Management
Suggested state shape:
```
{
  status: 'loading' | 'playing' | 'won' | 'lost' | 'error',
  category: string,
  hint: string,
  word: string,        // current answer, uppercase, no spaces
  guessed: string[],   // letters guessed so far, uppercase
  misses: number,       // 0-6
  announcement: string // for the aria-live region
}
```
- `attemptsLeft = 6 - misses`
- `missedLetters = guessed.filter(l => !word.includes(l))`
- Word list is a small local array of `{category, hint, word}` objects; a random entry is picked on each new game. In production, swap this for a real API call (this is what the Loading/Error states simulate — a fetch that takes ~700ms and can fail).
- Word source (used in the prototype, feel free to expand/replace with a real API):
  - ARCADE — "Classic maze chaser haunted by ghosts" — PACMAN
  - SPACE — "The red planet next door" — MARS
  - ANIMALS — "Wears black and white stripes like a highway" — ZEBRA
  - MUSIC — "Six strings, one riff away from a solo" — GUITAR
  - WEATHER — "The loud rumble after lightning" — THUNDER
  - FOOD — "Italian noodles, endless shapes" — PASTA

## Design Tokens

### Colors (OKLCH — convert to hex/rgb as needed for your tooling)
- `bg-page`: `oklch(96% 0.015 90)` — warm off-white page background
- `bg-panel`: `oklch(99% 0.005 90)` — card background
- `bg-raised`: `oklch(93% 0.015 90)` — keyboard key default background
- `border`: `oklch(55% 0.03 280)` — card borders, key borders
- `text-primary` / `dark`: `oklch(20% 0.02 280)`
- `text-secondary`: `oklch(40% 0.02 280)`
- `cyan` (correct / primary action): `oklch(52% 0.20 200)`
- `magenta` (wrong / lost): `oklch(52% 0.26 20)`
- `yellow` (win / hint accent): `oklch(68% 0.22 85)`
- `purple` (category badge / title / focus ring): `oklch(48% 0.28 300)`
- `ghost` (undrawn hangman parts): `oklch(85% 0.02 280)`
- Correct-key fill: bg `oklch(85% 0.16 200)`, text `oklch(25% 0.10 200)`
- Missed-letter chip: bg `oklch(90% 0.10 20)`, border `oklch(52% 0.26 20)`, text `oklch(40% 0.20 20)`
- Won banner bg: `oklch(80% 0.24 90)`
- Lost banner bg: `oklch(78% 0.20 25)`
- Attempts-left color ramp: cyan (5–6 left) → yellow (3–4 left) → magenta (0–2 left)

### Typography
- Display font: **Press Start 2P** (title, banners, attempts label, buttons, category badge) — used sparingly, short strings only (it's a pixel/blocky font, hard to read at length).
- Body font: **Space Mono** (hint text, missed-letter chips, keyboard letters, captions).
- Scale: 11px (micro/badges/captions) · 13px (body small) · 15px (body) · 18px (subheading) · 24px (masked-word letters) · clamp(26–42px) (page title, responsive).

### Spacing
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px.

### Shape / Effects
- Border radius: 4px (chips/keys), 6px (buttons), 8px (cards).
- Card border: 3px solid `border` color.
- Card shadow: hard offset shadow, no blur — `6px 6px 0 rgba(0,0,0,0.12)`.
- Button shadow: `4px 4px 0 rgba(0,0,0,0.15)`; on press/active, translate `(3px, 3px)` and drop shadow to `0 0 0` (simulates an arcade-button press).
- Focus ring (all interactive elements): `outline: 3px solid oklch(48% 0.28 300); outline-offset: 2–3px`.
- Banner pop-in: scale 0.85→1 + translateY 6px→0, 0.3s ease-out.
- Skeleton pulse: opacity 0.35↔0.7, 1.4s ease-in-out infinite.

## Assets
No image/icon assets — the hangman drawing is pure SVG (lines/circle), and the error glyph is a CSS border-triangle. No external assets to hand off.

## Responsive Behavior
- Fully fluid from 375px up; no fixed breakpoints — layout uses CSS Grid `auto-fit`/`auto-fill` with `minmax()` and `clamp()` for type/spacing so panels reflow from 2-column (desktop) to 1-column (mobile) automatically.
- All keyboard buttons maintain a 44px minimum height (touch-target minimum) at every width.

## Files
- `Hangman.dc.html` — the full working prototype (self-contained; open directly in a browser). Contains all markup + game logic for all 5 states plus the dev preview switcher described above.
- `screenshots/01-loading.png`, `02-playing.png`, `03-won.png`, `04-lost.png`, `05-error.png` — reference captures of each state.
