---
name: Lime on Graphite
description: Dark graphite canvas with electric lime accents, Hebrew-first RTL, terminal/code DNA — Heebo body, Secular One display, JetBrains Mono for code.
mode: dark
---

# Lime on Graphite

Hebrew-first (RTL) dark theme for an AI course. Derived from the project's `DESIGN.MD`. Terminal typing is the brand signature; code styling is a first-class citizen.

## Palette

| Role    | Value                      | Notes                                            |
| ------- | -------------------------- | ------------------------------------------------ |
| bg      | `#16181d`                  | graphite page background                         |
| surface | `#1e2128`                  | cards, code blocks, panels                       |
| border  | `rgba(237, 237, 232, 0.12)` | card borders, dividers                           |
| text    | `#edede8`                  | primary copy                                     |
| muted   | `#9aa0ab`                  | secondary copy, captions, footers                |
| accent  | `#c8f135`                  | lime — CTAs, eyebrows, key numbers, ONE glow max |
| cyan    | `#4fd8e8`                  | accent 2 — user / data                           |
| violet  | `#9d8cff`                  | accent 3 — system / meta                         |
| coral   | `#ff7a59`                  | accent 4 — warnings, contrast moments            |
| amber   | `#f5c542`                  | accent 5 — highlights                            |
| magenta | `#e86bb3`                  | accent 6 — rare, decorative                      |
| success | `#4ade80`                  | checkmarks, "works"                              |
| danger  | `#ff6b6b`                  | errors, "breaks"                                 |

Lime text on graphite passes contrast; **never** put lime text on a light surface. Lime-filled elements use `#16181d` text (`primary-foreground`).

## Typography

- Display font: `'Secular One', 'Heebo', sans-serif` — headlines. Secular One has a single weight (400); it reads heavy by design. Do not fake-bold it.
- Body font: `'Heebo', system-ui, sans-serif` — weight 400–500, 700 for emphasis.
- Code font: `'JetBrains Mono', 'Consolas', monospace` — all code, terminal lines, eyebrows, page numbers. Code is **always LTR** (`dir="ltr"`, `textAlign: 'left'`) even inside RTL pages.
- Type-scale overrides (vs `slide-authoring` defaults):
  - Hero title: 130–150 px (Secular One renders wide; stay at the low end)
  - Page heading: 56–72 px
  - Body: 34–40 px
  - Eyebrow / mono captions: 24–28 px

### Webfonts (load once, idempotently)

```tsx
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&family=Secular+One&display=swap';
if (typeof document !== 'undefined' && !document.getElementById('osd-webfont-lime-graphite')) {
  const link = document.createElement('link');
  link.id = 'osd-webfont-lime-graphite';
  link.rel = 'stylesheet';
  link.href = FONT_HREF;
  document.head.appendChild(link);
}
```

## Layout

- Content padding: 100–120 px from canvas edges (1920 × 1080).
- **RTL**: every page root sets `dir="rtl"`. Use logical/symmetric spacing only — no `marginLeft`/`paddingRight`; prefer `gap`, `padding: '0 120px'`, `insetInlineStart`/`insetInlineEnd`.
- Alignment: start-aligned (right in RTL) feels editorial — the default. Center only covers/section breaks.
- All user-facing text is Hebrew; code and role labels stay English.

## Fixed components

Paste-ready. Copy verbatim into slides using this theme.

### Title

```tsx
const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: "'Secular One', 'Heebo', sans-serif",
      fontSize: 140,
      fontWeight: 400,
      lineHeight: 1.1,
      letterSpacing: '-0.01em',
      margin: 0,
      color: '#edede8',
    }}
  >
    {children}
  </h1>
);
```

### Footer

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 100,
        right: 100,
        bottom: 48,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 22,
        color: '#9aa0ab',
        direction: 'ltr',
      }}
    >
      <span style={{ color: '#c8f135' }}>{'// ai-course'}</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};
```

### Eyebrow

Mono, lime, `//` prefix — the brand's "code comment" label.

```tsx
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 26,
      letterSpacing: '0.12em',
      color: '#c8f135',
      direction: 'ltr',
      textAlign: 'start',
    }}
  >
    {'// '}{children}
  </div>
);
```

### Code block

```tsx
const Code = ({ children }: { children: React.ReactNode }) => (
  <pre
    dir="ltr"
    style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 28,
      lineHeight: 1.6,
      background: '#1e2128',
      border: '1px solid rgba(237, 237, 232, 0.12)',
      borderRadius: 12,
      padding: '28px 36px',
      margin: 0,
      color: '#edede8',
      textAlign: 'left',
      overflow: 'hidden',
    }}
  >
    {children}
  </pre>
);
```

## Motion

- Philosophy: **subtle by default, rich only when the animation IS the content** (infographics, terminal typing). Lecture slides may stage reveals with `<Steps>`/`<Step>`; reading-heavy pages stay still.
- Hard rules (from DESIGN.MD): transform/opacity only for entrances; **one glow element per page max**; nothing loops except a caret blink or a single glow pulse; `prefers-reduced-motion` is handled by the framework.
- `<Step>` stays mounted and flips `data-osd-step="pending" → "revealed"`. To start a CSS animation at the moment of reveal, gate it on the attribute:

```css
[data-osd-step='revealed'] .lg-type { animation: lgType 1.2s steps(30, end) forwards; }
```

- Reusable keyframes (paste-ready):

```css
@keyframes lgFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lgCaret  { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes lgGlow   { 0%, 100% { box-shadow: 0 0 24px rgba(200, 241, 53, 0.25); } 50% { box-shadow: 0 0 48px rgba(200, 241, 53, 0.5); } }
@keyframes lgType   { from { width: 0; } to { width: 100%; } }
```

- Terminal typing (signature — covers and hero moments only): mono LTR line, `overflow: hidden; whiteSpace: nowrap`, `lgType` with `steps(n)` where n ≈ character count, plus a `lgCaret` blinking block in lime.
- Deck transition: RISE (6 px translateY + opacity, 140/200 ms, ease-in out / ease-out in) as the module default. At most one extra family (BREATH) for chapter dividers.

## Aesthetic

Linear-meets-terminal: a quiet graphite surface where lime is scarce and therefore loud. Editorial, start-aligned Hebrew typography (Secular One headlines carry the drama); code blocks and mono labels give the "built by developers" texture. Generous negative space, thin 1px borders, 12px radii. Avoid: gradients, stock imagery, more than one glow per page, decorative emoji, lime on light backgrounds, fake-bolding Secular One.

## Example usage

```tsx
const Cover: Page = () => (
  <div
    dir="rtl"
    style={{
      width: '100%', height: '100%', background: '#16181d', color: '#edede8',
      padding: '0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      fontFamily: "'Heebo', system-ui, sans-serif",
    }}
  >
    <Eyebrow>module 01</Eyebrow>
    <Title>מה באמת קורה בקריאה ל-LLM?</Title>
    <p style={{ fontSize: 38, color: '#9aa0ab', maxWidth: 1100, marginTop: 32, lineHeight: 1.6 }}>
      האנטומיה של הודעות, תפקידים והקשר — בלי קסמים.
    </p>
    <Footer />
  </div>
);
```
