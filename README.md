# Star Rating

A half-star rating widget, built in React (via Vite) — the first project in this portfolio trying a framework instead of vanilla JS.

## Why React, and why now

Everything else in this portfolio has been vanilla HTML/CSS/JS on purpose — no build step, open `index.html` and go. This one's a deliberate exception: the goal is to try React (and eventually Vue, and whatever else) under realistic conditions rather than a hacky CDN + in-browser Babel setup, before settling on one framework. So this project needs `npm install` and a dev server. That's the tradeoff.

## The logic

The interesting part isn't the UI, it's figuring out what rating a click or hover represents, and how to render that back as filled/half/empty stars. That's all in `src/lib/rating.js` and has nothing to do with React or the DOM:

- `ratingFromPointer(starIndex, fraction, allowHalf)` — given which star you're over and how far across it (0 to 1), returns the rating. Left half of a star rounds down to `.5`, right half rounds up to the full number.
- `getFillStates(rating, starCount)` — the inverse problem: given a rating, what should each star look like (`"full"`, `"half"`, or `"empty"`)?
- `stepRating` — for keyboard arrow-key nudging, clamped to the valid range.
- `clamp` / `roundToStep` — small helpers the above build on.

All of it is pure functions, no side effects, so `rating.test.js` runs them directly with `node --test`, no browser or React needed.

## Wiring it to React

`useRating` (a hook) is the only place that touches state — it calls the pure functions and stores the result. It also handles localStorage persistence, keyed per widget (`star-rating:<id>`), so each item in a list keeps its own rating independently and survives a refresh.

`useTheme` does the same job for light/dark mode — reads `prefers-color-scheme` as a default, then remembers whatever you pick.

`StarRating.jsx` composes everything: renders `Star` icons based on the current fill states, converts pointer position into a fraction the logic layer understands, and exposes `role="slider"` with `aria-valuenow`/`aria-valuetext` so arrow keys work and screen readers get a sensible readout — not just a click target.

`Star.jsx` renders each star as two stacked SVGs — an outline underneath, and a filled version on top clipped to 0/50/100% width depending on state. No icon font, no image assets.

## Running it

```
npm install
npm run dev
```

Tests (logic only, no React needed):

```
node --test src/lib/rating.test.js
```

Production build:

```
npm run build
```

## File structure

```
src/
  lib/rating.js         pure rating math
  lib/rating.test.js    node:test suite for the above
  hooks/useRating.js    state + localStorage, built on the pure logic
  hooks/useTheme.js     light/dark persistence
  components/Star.jsx        single star icon
  components/StarRating.jsx  the widget itself
  components/ThemeToggle.jsx
  App.jsx                demo: three items, each with an independent widget
```

## Honest gaps

- No component-level tests yet — only the pure logic is covered by `node:test`. Testing the React wiring itself would mean pulling in React Testing Library (and jsdom); decided that wasn't worth it for a project this size.
- No TypeScript yet. Plan is to convert once the React version feels settled, before trying the same widget in Vue for comparison.
- Only tested with mouse/pointer input plus keyboard; haven't specifically verified touch behavior on a real device.
