# Genie Greenie Visual Agent Guide

Use this file as the source of truth for preserving the current Genie Greenie aesthetic when generating UI.

## Brand Feel
- Friendly, educational, and approachable.
- Nature-forward palette (greens/yellows/blues) with clean white content surfaces.
- Rounded, soft UI with clear contrast and simple interactions.

## Typography
- Heading/display font: `Young Serif` via `font-Young_Serif`.
- Body font: `Inter` via `font-inter`.
- Current pattern:
  - Brand titles, major headings, and nav labels use `font-Young_Serif`.
  - Paragraphs and long-form content use `font-inter`.

## Color System

### Tailwind custom colors (from `tailwind.config.ts`)
- `lightgreen`: `#A1C181`
- `darkyellow`: `#FCBF49`
- `lightblue`: `#5FA7D3`
- `lightyellow`: `#FFF6C8`
- `darkgreen`: `#619B8A`
- `orange`: `#FE7F2D`
- `darkblue`: `#233D4D`

### Frequently used utility colors in current UI
- Top-level page backdrop: `bg-sky-100`
- Navigation shell: `bg-sky-800 text-white`
- Primary action/quiz color: `bg-green-700` (hover toward `bg-green-500`)
- Main content cards: `bg-white`
- Link/body emphasis: `text-sky-800` / `text-sky-900`

## Core Layout Patterns
- App shell:
  - Full page uses sky background (`bg-sky-100`).
  - Content lives in a centered white panel with mild transparency:
    - `bg-white bg-opacity-85 rounded-xl shadow-lg`
- Decorative background:
  - Fixed bottom SVG wave motif.
  - Gradient blend from yellow to green (`#fef08a` -> `#16a34a`).
- Navigation:
  - Sticky top bar in `bg-sky-800`.
  - White text, serif brand treatment, logo-driven identity.
- Mobile footer nav:
  - Floating rounded-full pill, centered near bottom.
  - `bg-green-700`, white icons/text, high opacity.

## Component Styling Patterns
- Quiz/training cards consistently use:
  - `bg-white p-4/p-6 rounded-lg shadow-lg border-green-700 border-2 text-center`
- Clickable card hover behavior:
  - `hover:bg-green-700 hover:text-white cursor-pointer`
- Secondary/outline action pattern:
  - `border-green-700 text-green-700 border-2`
  - On hover: `hover:bg-green-500 hover:text-white`
- Primary buttons:
  - Green, high contrast, rounded corners, simple transitions.

## Motion and Effects
- Keep animation lightweight and functional.
- Existing style favors:
  - subtle hover color transitions (`transition`)
  - modest duration values (around 200-300ms)
  - shadow depth over heavy transforms

## Imagery and Iconography
- Mascot/logo visuals are central to brand recognition.
- Use simple, friendly icon sets (current app uses heroicons/react-icons).
- Prefer clear illustrative accents over dense decorative clutter.

## Implementation Rules for Future UI Changes
- Keep the serif + sans pairing (`Young Serif` + `Inter`) intact.
- Preserve the sky/green/white structure before introducing new tones.
- Reuse existing card/button patterns for consistency.
- Maintain rounded corners and medium shadow depth (`rounded-lg/xl`, `shadow-lg/md`).
- Avoid dark mode-first redesigns or neon/purple-heavy palettes.
- For new screens, start from:
  - sky page background
  - white rounded content container
  - green primary interactions
  - serif headings and nav branding

## Quick Class Recipes
- Main panel: `mx-4 md:mx-24 mb-24 mt-4 bg-white rounded-xl shadow-lg p-4 md:p-8 bg-opacity-85`
- Standard content card: `w-full lg:max-w-2xl bg-white p-6 rounded-lg shadow-lg border-green-700 border-2 text-center mx-auto`
- Interactive card: `w-full bg-white p-4 rounded-lg shadow-lg border-green-700 border-2 text-center transition hover:bg-green-700 hover:text-white cursor-pointer`
- Outline button: `border-green-700 border-2 text-green-700 hover:bg-green-500 hover:text-white p-2`
- Primary button: `bg-green-700 text-white rounded hover:bg-green-500 transition`
