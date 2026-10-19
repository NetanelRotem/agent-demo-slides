import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

// Lime on Graphite (see DESIGN.MD), adapted for an English, left-to-right deck.

export const design: DesignSystem = {
  palette: { bg: '#16181d', text: '#edede8', accent: '#c8f135' },
  fonts: {
    display: "'Secular One', 'Heebo', sans-serif",
    body: "'Heebo', system-ui, sans-serif",
  },
  typeScale: { hero: 140, body: 38 },
  radius: 12,
};

const c = {
  surface: '#1e2128',
  border: 'rgba(237, 237, 232, 0.12)',
  muted: '#9aa0ab',
  cyan: '#4fd8e8',
  violet: '#9d8cff',
  success: '#4ade80',
};

const mono = "'JetBrains Mono', 'Consolas', monospace";

// --- Fonts and keyframes: injected once per slide, create-or-update for HMR ---

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&family=Secular+One&display=swap';
const FONT_LINK_ID = 'osd-webfont-coding-agent';
const STYLE_ID = 'osd-styles-coding-agent';
const css = `
@keyframes lgFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lgCaret  { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes lgType   { from { width: 0; } to { width: var(--lg-chars); } }
.lg-live .lg-type { animation: lgType 0.9s steps(var(--lg-steps), end) 0.4s both; }
.lg-live .lg-line { animation: lgFadeUp 0.45s cubic-bezier(0, 0, 0.2, 1) both; }
.lg-caret { animation: lgCaret 1s step-end infinite; }
`;

if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;

  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== css) style.textContent = css;
}

// --- Fixed components (DESIGN.MD) ---

const Title = ({ children }: { children: ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 400,
      lineHeight: 1.1,
      letterSpacing: '-0.01em',
      margin: 0,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </h1>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: mono, fontSize: 26, letterSpacing: '0.12em', color: 'var(--osd-accent)' }}>
    {'// '}
    {children}
  </div>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 48,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: mono,
        fontSize: 22,
        color: c.muted,
      }}
    >
      <span style={{ color: 'var(--osd-accent)' }}>{'// coding-agent-graph'}</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// One terminal line that fades up after `delay` seconds once the page is live.
const TermLine = ({ delay, children }: { delay: number; children: ReactNode }) => (
  <div className="lg-line" style={{ animationDelay: `${delay}s`, display: 'flex', gap: 28 }}>
    {children}
  </div>
);

// --- Pages ---

const Cover: Page = () => {
  const active = useIsActivePage();
  const command = '/agent start';
  return (
    <div
      className={active ? 'lg-live' : undefined}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
        padding: '0 120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      <Eyebrow>live demo</Eyebrow>
      <Title>
        From GitHub Issue
        <br />
        to <span style={{ color: 'var(--osd-accent)' }}>Pull Request</span>
      </Title>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 16 }}>
        <p style={{ fontSize: 'var(--osd-size-body)', color: c.muted, lineHeight: 1.5, margin: 0, maxWidth: 820 }}>
          A coding agent that plans, writes, tests and ships, while you just comment.
        </p>

      <div
        style={{
          width: 640,
          flexShrink: 0,
          background: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: 'var(--osd-radius)',
          padding: '32px 40px',
          fontFamily: mono,
          fontSize: 28,
          lineHeight: 1.9,
          boxShadow: '0 0 40px rgba(200, 241, 53, 0.12)',
        }}
      >
        <div style={{ fontSize: 22, color: c.muted, marginBottom: 12 }}>issue #12 · comment</div>
        <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
          <span style={{ color: c.muted, marginRight: 16 }}>$</span>
          <span
            className="lg-type"
            style={
              {
                '--lg-chars': `${command.length}ch`,
                '--lg-steps': command.length,
                display: 'inline-block',
                overflow: 'hidden',
                width: `${command.length}ch`,
                color: c.cyan,
              } as CSSProperties
            }
          >
            {command}
          </span>
          <span
            className="lg-caret"
            style={{ display: 'inline-block', width: 14, height: 32, marginLeft: 6, background: 'var(--osd-accent)' }}
          />
        </div>
        <TermLine delay={1.5}>
          <span style={{ color: c.success, width: 28 }}>✓</span>
          <span style={{ width: 150 }}>plan</span>
          <span style={{ color: c.muted }}>4 steps · simple</span>
        </TermLine>
        <TermLine delay={2.0}>
          <span style={{ color: c.success, width: 28 }}>✓</span>
          <span style={{ width: 150 }}>verify</span>
          <span style={{ color: c.muted }}>lint · build</span>
        </TermLine>
        <TermLine delay={2.5}>
          <span style={{ color: 'var(--osd-accent)', width: 28 }}>→</span>
          <span style={{ width: 150, color: 'var(--osd-accent)' }}>PR #13</span>
          <span style={{ color: c.violet }}>ready for review</span>
        </TermLine>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// RISE: the deck's single house transition (DESIGN.MD › Motion).
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
export const transition: SlideTransition = {
  duration: 200,
  exit: { duration: 140, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 200,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'Coding Agent: Issue to PR',
  createdAt: '2026-10-19T12:35:44.348Z',
};

export const notes: (string | undefined)[] = [
  `Open with the one-line promise: you write an Issue, the agent hands back a Pull Request.
Let the terminal finish typing before speaking about the three stages.`,
];

export default [Cover] satisfies Page[];
