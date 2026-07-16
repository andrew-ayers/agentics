# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## Architecture

Single-page Vue 3 + Vite app (no router, no state library). All logic is in one composable.

### Data layer (`src/data/`)
- `colorCode.js` — source of truth for all color-to-value mappings. Each color object has `digit`, `multiplier`, `tolerance` (null = invalid in that role). Also exports `isValidForPosition(color, position, bandCount)` which encodes all validation rules.
- `eSeries.js` — E24/E96 standard value sets. Used silently to break ties when both read directions produce valid decodings. Not shown in the UI.

### Decode logic (`src/composables/useResistorDecoder.js`)
Single composable consumed by `App.vue`. Exposes reactive `bands` (array of color name strings or null), `bandCount` (4 or 5), and a computed `result` object. The result has a `state` field: `'idle'` | `'valid'` | `'ambiguous'` | `'error'`.

Auto-direction algorithm:
1. Attempt decode in forward order
2. Attempt decode in reversed order
3. If one is valid and the other isn't → use the valid one
4. If both are valid → compare E-series scores; higher score wins
5. If scores are tied → return `state: 'ambiguous'` with both readings

### Components (`src/components/`)
- `BandSelector.vue` — band slot button that opens a `ColorPalette` popover (Teleported to body). Receives `validColors` prop so invalid swatches render grayed-out but visible.
- `ColorPalette.vue` — 3-column swatch grid. Emits `select` event.
- `ResistorVisual.vue` — purely presentational SVG. Band x-positions are hardcoded per band count (4 or 5) to match resistor conventions (tolerance band offset to the right).
- `ResultDisplay.vue` — renders one of four states driven by `result.state`.

### State flow
`App.vue` owns `setBandCount` (persists first N bands, clears the rest) and passes everything down as props. No shared store — all state lives in the composable.
