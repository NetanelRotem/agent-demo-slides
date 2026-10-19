import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  Step,
  Steps,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';
import dashboardShot from './assets/dashboard.png';
import langgraphPng from './assets/langgraph.png';

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
  bg: '#16181d',
  surface: '#1e2128',
  border: 'rgba(237, 237, 232, 0.12)',
  text: '#edede8',
  muted: '#9aa0ab',
  lime: '#c8f135',
  cyan: '#4fd8e8',
  violet: '#9d8cff',
  coral: '#ff7a59',
  amber: '#f5c542',
  success: '#4ade80',
  danger: '#ff6b6b',
};

const mono = "'JetBrains Mono', 'Consolas', monospace";

// --- Fonts and keyframes: injected once per slide, create-or-update for HMR ---

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&family=Secular+One&display=swap';
const FONT_LINK_ID = 'osd-webfont-coding-agent';
const STYLE_ID = 'osd-styles-coding-agent';
const EASE = 'cubic-bezier(0, 0, 0.2, 1)';
const css = `
@keyframes lgFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lgFade   { from { opacity: 0; } to { opacity: 1; } }
@keyframes lgCaret  { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes lgGlow   { 0%, 100% { box-shadow: 0 0 24px rgba(200, 241, 53, 0.18); } 50% { box-shadow: 0 0 48px rgba(200, 241, 53, 0.42); } }
@keyframes lgType   { from { width: 0; } to { width: var(--lg-chars); } }
@keyframes lgDraw   { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes lgTravel {
  0% { offset-distance: 0%; opacity: 0; }
  6% { opacity: 1; }
  88% { opacity: 1; }
  100% { offset-distance: 100%; opacity: 0; }
}
.lg-live .lg-type, [data-osd-step='revealed'] .lg-type-step {
  animation: lgType 1.1s steps(var(--lg-steps), end) 0.3s both;
}
.lg-live .lg-line { animation: lgFadeUp 0.45s ${EASE} both; }
.lg-caret { animation: lgCaret 1s step-end infinite; }
.lg-glow { animation: lgGlow 2.4s ease-in-out infinite; }
[data-osd-step='revealed'] .lg-draw { animation: lgDraw 0.6s ${EASE} both; }
[data-osd-step='revealed'] .lg-head { animation: lgFade 0.2s ease-out 0.45s both; }
[data-osd-step='revealed'] .lg-pop { animation: lgFadeUp 0.4s ${EASE} both; }
.lg-packet { offset-rotate: 0deg; opacity: 0; }
[data-osd-step='revealed'] .lg-packet {
  animation-name: lgTravel;
  animation-timing-function: cubic-bezier(0.45, 0, 0.25, 1);
  animation-fill-mode: both;
}
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

const Heading = ({ children }: { children: ReactNode }) => (
  <h2
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 64,
      fontWeight: 400,
      lineHeight: 1.15,
      margin: 0,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </h2>
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

const Code = ({ children, size = 24 }: { children: ReactNode; size?: number }) => (
  <pre
    style={{
      fontFamily: mono,
      fontSize: size,
      lineHeight: 1.55,
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: '24px 36px',
      margin: 0,
      color: c.text,
      textAlign: 'left',
    }}
  >
    {children}
  </pre>
);

// Syntax colors for hand-written code samples.
const K = ({ children }: { children: ReactNode }) => <span style={{ color: c.violet }}>{children}</span>;
const S = ({ children }: { children: ReactNode }) => <span style={{ color: c.amber }}>{children}</span>;
const F = ({ children }: { children: ReactNode }) => <span style={{ color: c.cyan }}>{children}</span>;
const Cm = ({ children }: { children: ReactNode }) => <span style={{ color: c.muted }}>{children}</span>;

// --- Page shell: eyebrow + heading on top, a 1680 × 680 stage for diagrams ---

const STAGE_W = 1680;
const STAGE_H = 680;

const Slide = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '96px 120px 0',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading>{title}</Heading>
    </div>
    <div style={{ position: 'absolute', left: 120, top: 280, width: STAGE_W, height: STAGE_H }}>{children}</div>
    <Footer />
  </div>
);

// --- Diagram kit: zones, boxes, arrows, labels and travelling packets ---

type Kind = 'github' | 'core' | 'sandbox' | 'secure' | 'ext' | 'human' | 'ok' | 'bad';
const kindColor: Record<Kind, string> = {
  github: c.cyan,
  core: c.lime,
  sandbox: c.violet,
  secure: c.coral,
  ext: c.muted,
  human: c.amber,
  ok: c.success,
  bad: c.danger,
};

type Pt = [number, number];

const Zone = ({
  x,
  y,
  w,
  h,
  kind,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: Kind;
  label: string;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      border: `1.5px dashed ${kindColor[kind]}66`,
      borderRadius: 16,
      background: 'rgba(237, 237, 232, 0.015)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 20,
        top: 14,
        fontFamily: mono,
        fontSize: 22,
        color: kindColor[kind],
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  </div>
);

type BoxProps = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  kind: Kind;
  tag?: string;
  title: ReactNode;
  sub?: ReactNode;
  strong?: boolean;
  monoTitle?: boolean;
  titleSize?: number;
  className?: string;
  children?: ReactNode;
};

const Box = ({ x, y, w, h, kind, tag, title, sub, strong, monoTitle, titleSize = 28, className, children }: BoxProps) => {
  const color = kindColor[kind];
  const placed: CSSProperties = x === undefined ? {} : { position: 'absolute', left: x, top: y };
  return (
    <div
      className={className}
      style={{
        ...placed,
        width: w,
        height: h,
        boxSizing: 'border-box',
        background: strong ? `color-mix(in srgb, ${color} 9%, ${c.surface})` : c.surface,
        border: `1px solid ${strong ? color : `${color}59`}`,
        borderRadius: 'var(--osd-radius)',
        padding: '12px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        zIndex: 1,
      }}
    >
      {tag && <div style={{ fontFamily: mono, fontSize: 20, color, lineHeight: 1.3 }}>{tag}</div>}
      <div
        style={{
          fontFamily: monoTitle ? mono : 'var(--osd-font-body)',
          fontSize: monoTitle ? 24 : titleSize,
          fontWeight: monoTitle ? 500 : 700,
          lineHeight: 1.25,
          color: c.text,
        }}
      >
        {title}
      </div>
      {sub && <div style={{ fontSize: 22, color: c.muted, lineHeight: 1.35 }}>{sub}</div>}
      {children}
    </div>
  );
};

const Label = ({ x, y, color = c.muted, children }: { x: number; y: number; color?: string; children: ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      background: c.bg,
      padding: '2px 10px',
      borderRadius: 6,
      fontFamily: mono,
      fontSize: 20,
      color,
      whiteSpace: 'nowrap',
      zIndex: 2,
    }}
  >
    {children}
  </div>
);

const toPath = (pts: Pt[]) => `M ${pts.map((p) => p.join(' ')).join(' L ')}`;

const Arrow = ({
  pts,
  color = c.muted,
  dashed,
  width = 2,
  label,
  at,
  labelColor,
}: {
  pts: Pt[];
  color?: string;
  dashed?: boolean;
  width?: number;
  label?: string;
  at?: Pt;
  labelColor?: string;
}) => {
  const [x1, y1] = pts[pts.length - 2];
  const [x2, y2] = pts[pts.length - 1];
  const a = Math.atan2(y2 - y1, x2 - x1);
  const size = 12 + width;
  const head = [
    [x2, y2],
    [x2 - size * Math.cos(a - 0.42), y2 - size * Math.sin(a - 0.42)],
    [x2 - size * Math.cos(a + 0.42), y2 - size * Math.sin(a + 0.42)],
  ]
    .map((p) => p.join(','))
    .join(' ');
  return (
    <>
      <svg
        width={STAGE_W}
        height={STAGE_H}
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}
      >
        {dashed ? (
          <path
            d={toPath(pts)}
            className="lg-pop"
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeDasharray="8 8"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d={toPath(pts)}
            className="lg-draw"
            pathLength={1}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeDasharray="1"
            strokeLinejoin="round"
          />
        )}
        <polygon points={head} fill={color} className="lg-head" />
      </svg>
      {label && at && (
        <Label x={at[0]} y={at[1]} color={labelColor ?? color}>
          {label}
        </Label>
      )}
    </>
  );
};

// A labelled pill that travels along `pts` when its <Step> is revealed.
const Packet = ({
  pts,
  color,
  label,
  dur = 2.4,
  delay = 0,
}: {
  pts: Pt[];
  color: string;
  label: string;
  dur?: number;
  delay?: number;
}) => (
  <div
    className="lg-packet"
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      offsetPath: `path('${toPath(pts)}')`,
      offsetDistance: '100%',
      animationDuration: `${dur}s`,
      animationDelay: `${delay}s`,
      background: color,
      color: c.bg,
      fontFamily: mono,
      fontSize: 20,
      fontWeight: 700,
      padding: '4px 14px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      zIndex: 5,
    }}
  >
    {label}
  </div>
);

const Bullet = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 18 }}>
    <span style={{ color: c.lime, fontFamily: mono }}>→</span>
    <span>{children}</span>
  </div>
);

const Caption = ({ x, y, color, children }: { x: number; y: number; color: string; children: ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontSize: 26,
      color: c.text,
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{ width: 14, height: 14, borderRadius: 7, background: color, flexShrink: 0 }} />
    {children}
  </div>
);

// --- 01 · Cover ---

const TermLine = ({ delay, children }: { delay: number; children: ReactNode }) => (
  <div className="lg-line" style={{ animationDelay: `${delay}s`, display: 'flex', gap: 28 }}>
    {children}
  </div>
);

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
      <Eyebrow>build it yourself</Eyebrow>
      <Title>
        Build your own
        <br />
        Coding Agent <span style={{ color: 'var(--osd-accent)' }}>Factory</span>
      </Title>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 16 }}>
        <p style={{ fontSize: 'var(--osd-size-body)', color: c.muted, lineHeight: 1.5, margin: 0, maxWidth: 820 }}>
          From a GitHub Issue to a tested Pull Request. The architecture, box by box.
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

// --- 02 · The idea ---

const IdeaBox = ({ x, kind, tag, title, sub }: { x: number; kind: Kind; tag: string; title: string; sub: string }) => (
  <Box x={x} y={60} w={440} h={300} kind={kind} tag={tag} title={title} sub={sub} titleSize={56} />
);

const Idea: Page = () => (
  <Slide eyebrow="the idea" title="Issue in. Pull Request out.">
    <IdeaBox x={0} kind="github" tag="01 · the task" title="Issue" sub="What to build, in plain English." />
    <Steps>
      <Step>
        <Arrow pts={[[452, 210], [608, 210]]} color={c.lime} width={3} />
        <IdeaBox
          x={620}
          kind="core"
          tag="02 · the conversation"
          title="Comments"
          sub="/agent start, approve, answer. Right on the Issue."
        />
      </Step>
      <Step>
        <Arrow pts={[[1072, 210], [1228, 210]]} color={c.lime} width={3} />
        <IdeaBox x={1240} kind="ok" tag="03 · the output" title="Pull Request" sub="Tested code, reviewed like any other PR." />
      </Step>
      <Step>
        <p style={{ position: 'absolute', left: 0, top: 440, margin: 0, fontSize: 38, color: c.muted, lineHeight: 1.5 }}>
          It works where the team already works. <span style={{ color: c.text }}>No new tool to learn.</span>
        </p>
      </Step>
    </Steps>
  </Slide>
);

// --- 03 · Three principles ---

const Principle = ({ n, title, body, how }: { n: string; title: string; body: string; how: string }) => (
  <div
    style={{
      height: 480,
      boxSizing: 'border-box',
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: '36px 36px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 40, color: c.lime }}>{n}</div>
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 44, lineHeight: 1.15 }}>{title}</div>
    <div style={{ fontSize: 30, color: c.muted, lineHeight: 1.45 }}>{body}</div>
    <div style={{ marginTop: 'auto', fontFamily: mono, fontSize: 21, color: c.cyan }}>{how}</div>
  </div>
);

const Principles: Page = () => (
  <Slide eyebrow="principles" title="Three rules the factory runs on">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
      <Steps>
        <Step duration={300}>
          <Principle
            n="01"
            title="People decide, the agent executes"
            body="A person approves complex plans and reviews every PR."
            how="approve · review · manual merge"
          />
        </Step>
        <Step duration={300}>
          <Principle
            n="02"
            title="The agent gets no keys"
            body="It codes in a cloud sandbox. Secrets are added outside, at the network."
            how="placeholder → proxy → real key"
          />
        </Step>
        <Step duration={300}>
          <Principle
            n="03"
            title="Checks, not promises"
            body="The server runs lint and build itself. No green, no PR."
            how="npm run lint · npm run build"
          />
        </Step>
      </Steps>
    </div>
  </Slide>
);

// --- 04 · The flow, from the user's side ---

const UserFlow: Page = () => (
  <Slide eyebrow="the flow" title="What the user sees">
    <Box x={0} y={220} w={200} h={110} kind="github" tag="github" title="Issue" />
    <Box x={300} y={220} w={200} h={110} kind="core" tag="agent" title="Plan" />
    <Box x={530} y={40} w={260} h={110} kind="human" tag="human" title="Approve?" />
    <Box x={820} y={220} w={220} h={110} kind="sandbox" tag="sandbox" title="Code" />
    <Box x={1120} y={220} w={200} h={110} kind="core" tag="server" title="Checks" />
    <Box x={1420} y={220} w={260} h={110} kind="github" tag="github" title="Pull Request" />
    <Box x={1420} y={450} w={260} h={110} kind="human" tag="human" title="Review" />
    <Box x={1120} y={450} w={200} h={110} kind="ok" tag="pages" title="Deployed" />

    <Arrow pts={[[200, 275], [300, 275]]} />
    <Arrow pts={[[500, 275], [820, 275]]} color={c.lime} label="simple" at={[660, 275]} />
    <Arrow pts={[[400, 220], [400, 95], [530, 95]]} color={c.amber} label="complex" at={[400, 160]} />
    <Arrow pts={[[790, 95], [930, 95], [930, 220]]} color={c.amber} label="approve" at={[930, 160]} />
    <Arrow pts={[[1040, 275], [1120, 275]]} />
    <Arrow pts={[[1220, 220], [1220, 185], [985, 185], [985, 220]]} color={c.danger} label="fail · retry" at={[1100, 185]} />
    <Arrow pts={[[1320, 275], [1420, 275]]} color={c.success} label="pass" at={[1370, 245]} />
    <Arrow pts={[[1550, 330], [1550, 450]]} />
    <Arrow pts={[[1420, 505], [1320, 505]]} color={c.success} label="merge" at={[1370, 475]} />
    <Arrow
      pts={[[1550, 560], [1550, 625], [930, 625], [930, 330]]}
      dashed
      color={c.cyan}
      label="changes requested"
      at={[1240, 625]}
    />

    <Steps>
      <Step>
        <Caption x={0} y={460} color={c.lime}>
          simple → straight to code
        </Caption>
        <Packet
          pts={[[100, 275], [400, 275], [930, 275], [1220, 275], [1550, 275]]}
          color={c.lime}
          label="simple"
          dur={2.6}
        />
      </Step>
      <Step>
        <Caption x={0} y={510} color={c.amber}>
          complex → a person approves first
        </Caption>
        <Packet
          pts={[
            [100, 275],
            [400, 275],
            [400, 95],
            [660, 95],
            [930, 95],
            [930, 275],
            [1220, 275],
            [1550, 275],
            [1550, 505],
            [1220, 505],
          ]}
          color={c.amber}
          label="complex"
          dur={4.2}
        />
      </Step>
    </Steps>
  </Slide>
);

// --- 05 · Live demo (chapter break) ---

const Demo: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '0 120px',
      display: 'flex',
      alignItems: 'center',
      gap: 80,
    }}
  >
    <div style={{ width: 640, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 36 }}>
      <Eyebrow>live demo</Eyebrow>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 100, lineHeight: 1.08 }}>
        Let's watch
        <br />
        one <span style={{ color: c.lime }}>run</span>
      </div>
      <div style={{ fontSize: 32, color: c.muted, lineHeight: 1.5 }}>
        Issue #12 · "Keep todos after a page refresh"
      </div>
      <div style={{ fontFamily: mono, fontSize: 26, color: c.text, lineHeight: 1.8 }}>
        <div>
          <span style={{ color: c.lime }}>8</span> runs · <span style={{ color: c.lime }}>5</span> PRs
        </div>
        <div>
          <span style={{ color: c.lime }}>$1.04</span> total model cost
        </div>
      </div>
    </div>
    <div
      style={{
        flex: 1,
        border: `1px solid ${c.border}`,
        borderRadius: 'var(--osd-radius)',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
      }}
    >
      <img src={dashboardShot} alt="The live dashboard" style={{ display: 'block', width: '100%' }} />
    </div>
    <Footer />
  </div>
);

// --- 06 · The building blocks ---

const Block = ({ tag, title, alt }: { tag: string; title: string; alt: string }) => (
  <Box kind="ext" tag={tag} title={title} sub={`alt: ${alt}`} h={150} titleSize={30} />
);

const Layer = ({ n, name, color, children }: { n: string; name: string; color: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ fontFamily: mono, fontSize: 24, color, height: 40, borderBottom: `2px solid ${color}` }}>
      {n} · {name}
    </div>
    {children}
  </div>
);

const Stack: Page = () => (
  <Slide eyebrow="the stack" title="The building blocks, and what to swap in">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
      <Steps>
        <Step>
          <Layer n="01" name="receive" color={c.cyan}>
            <Block tag="trigger" title="GitHub webhooks" alt="GitLab, Linear, Jira" />
            <Block tag="server" title="FastAPI" alt="Express, Flask, any HTTP" />
          </Layer>
        </Step>
        <Step>
          <Layer n="02" name="orchestrate" color={c.lime}>
            <Block tag="state machine" title="LangGraph" alt="Temporal, a states table" />
            <Block tag="memory" title="SQLite" alt="Postgres" />
          </Layer>
        </Step>
        <Step>
          <Layer n="03" name="execute" color={c.violet}>
            <Block tag="coding agent" title="Pi" alt="Claude Code, Codex, Aider" />
            <Block tag="model gateway" title="OpenRouter" alt="any LLM API" />
            <Block tag="isolation" title="Docker Cloud Sandboxes" alt="E2B, Daytona, Docker" />
          </Layer>
        </Step>
        <Step>
          <Layer n="04" name="observe" color={c.amber}>
            <Block tag="live UI" title="Dashboard" alt="Grafana, a static page" />
            <Block tag="alerts" title="Telegram" alt="Slack, email" />
            <Block tag="tracing" title="Langfuse" alt="LangSmith, OpenTelemetry" />
          </Layer>
        </Step>
      </Steps>
    </div>
  </Slide>
);

// --- 07 · Architecture ---

const Architecture: Page = () => (
  <Slide eyebrow="architecture" title="Three zones, one proxy">
    <Zone x={0} y={0} w={290} h={480} kind="github" label="GitHub" />
    <Box x={25} y={60} w={240} h={120} kind="github" tag="trigger" title="Issues" sub="webhook on /agent" />
    <Box x={25} y={200} w={240} h={120} kind="github" tag="output" title="Pull requests" sub="reviews, comments" />

    <Steps>
      <Step>
        <Zone x={350} y={0} w={800} h={480} kind="core" label="Server · FastAPI · your laptop or a VM" />
        <Box x={380} y={60} w={340} h={120} kind="core" tag="main.py" title="Webhook" sub="HMAC check · parse /agent" />
        <Box x={380} y={200} w={340} h={120} kind="core" tag="service.py" title="Queue + worker" sub="durable, in SQLite" />
        <Box x={380} y={340} w={340} h={120} kind="core" tag="agent_graph.py" title="LangGraph" sub="the state machine" strong />
        <Box x={780} y={60} w={340} h={120} kind="core" tag="workspace.py" title="Verify & push" sub="lint · build · commit" />
        <Box x={780} y={200} w={340} h={120} kind="core" tag="pi_runner.py" title="Pi runner" sub="start Pi · stream events" />
        <Box x={780} y={340} w={340} h={120} kind="ext" tag="storage.py" title="SQLite" sub="checkpoints · runs · events" />
        <Arrow pts={[[265, 120], [380, 120]]} color={c.cyan} />
        <Arrow pts={[[265, 260], [320, 260], [320, 140], [380, 140]]} color={c.cyan} />
        <Arrow pts={[[550, 180], [550, 200]]} />
        <Arrow pts={[[550, 320], [550, 340]]} />
        <Arrow pts={[[720, 400], [750, 400], [750, 260], [780, 260]]} color={c.lime} />
        <Arrow pts={[[720, 400], [750, 400], [750, 120], [780, 120]]} color={c.lime} />
        <Arrow pts={[[720, 440], [780, 440]]} />
        <Arrow pts={[[380, 420], [145, 420], [145, 320]]} color={c.cyan} label="comments · PR" at={[262, 420]} />
      </Step>
      <Step>
        <Zone x={1210} y={0} w={470} h={480} kind="sandbox" label="Cloud sandbox · one per run" />
        <Box x={1240} y={60} w={410} h={120} kind="sandbox" tag="agent.sh" title="Clone, check, push" sub="runs inside the VM" />
        <Box x={1240} y={200} w={410} h={120} kind="sandbox" tag="pi" title="Pi coding agent" sub="edits the repo clone" />
        <Box x={1240} y={340} w={410} h={120} kind="secure" tag="proxy" title="Egress proxy" sub="adds secrets · deny-all" strong />
        <Arrow pts={[[1120, 260], [1240, 260]]} color={c.violet} label="sbx exec" at={[1180, 230]} />
        <Arrow pts={[[1120, 120], [1240, 120]]} color={c.violet} label="sbx exec" at={[1180, 90]} />
        <Arrow pts={[[1445, 320], [1445, 340]]} dashed color={c.coral} />
        <Arrow pts={[[1650, 120], [1667, 120], [1667, 400], [1650, 400]]} dashed color={c.coral} />
      </Step>
      <Step>
        <Box x={350} y={560} w={250} h={100} kind="human" tag="/dashboard" title="Dashboard" />
        <Box x={625} y={560} w={250} h={100} kind="human" tag="key events" title="Telegram" />
        <Box x={900} y={560} w={250} h={100} kind="human" tag="traces" title="Langfuse" />
        <Box x={1210} y={560} w={220} h={100} kind="ext" tag="LLM" title="OpenRouter" />
        <Box x={1460} y={560} w={220} h={100} kind="ext" tag="git push" title="github.com" />
        <Arrow pts={[[950, 460], [950, 515], [475, 515], [475, 560]]} dashed color={c.amber} />
        <Arrow pts={[[950, 460], [950, 515], [750, 515], [750, 560]]} dashed color={c.amber} />
        <Arrow pts={[[950, 460], [950, 515], [1025, 515], [1025, 560]]} dashed color={c.amber} />
        <Arrow pts={[[1320, 460], [1320, 560]]} dashed color={c.coral} />
        <Arrow pts={[[1570, 460], [1570, 560]]} dashed color={c.coral} />
      </Step>
      <Step>
        <Packet
          pts={[
            [145, 120],
            [550, 120],
            [550, 400],
            [750, 400],
            [750, 260],
            [1445, 260],
            [1445, 400],
            [1320, 400],
            [1320, 610],
          ]}
          color={c.cyan}
          label="/agent start"
          dur={3.6}
        />
        <Packet pts={[[550, 400], [145, 420], [145, 260]]} color={c.lime} label="PR #13" dur={1.4} delay={3.8} />
      </Step>
    </Steps>
  </Slide>
);

// --- 08 · Why LangGraph ---

const PauseBars = () => (
  <span style={{ display: 'inline-flex', gap: 6, marginRight: 12, verticalAlign: 'middle' }}>
    <span style={{ width: 7, height: 24, background: c.amber, borderRadius: 2 }} />
    <span style={{ width: 7, height: 24, background: c.amber, borderRadius: 2 }} />
  </span>
);

const TimeBox = (props: BoxProps) => <Box y={40} w={300} h={170} {...props} />;

const LangGraphWhy: Page = () => (
  <Slide eyebrow="why langgraph" title="A run can wait for days">
    <TimeBox x={0} kind="core" tag="node" title="plan_with_pi" sub="posts the plan on the Issue" />
    <Steps>
      <Step>
        <Arrow pts={[[300, 125], [345, 125]]} />
        <TimeBox
          x={345}
          kind="human"
          tag="interrupt()"
          title={
            <>
              <PauseBars />
              Pause
            </>
          }
          sub="state saved, worker freed"
          strong
          className="lg-glow"
        />
      </Step>
      <Step>
        <Arrow pts={[[645, 125], [690, 125]]} dashed />
        <TimeBox x={690} kind="ext" tag="hours … days" title="Nothing runs" sub="sandbox stopped, costs $0" />
      </Step>
      <Step>
        <Arrow pts={[[990, 125], [1035, 125]]} dashed />
        <TimeBox x={1035} kind="github" tag="webhook" title="/agent approve" sub="from any device" />
      </Step>
      <Step>
        <Arrow pts={[[1335, 125], [1380, 125]]} color={c.lime} />
        <TimeBox x={1380} kind="core" tag="Command(resume=…)" title="Continue" sub="same node, even after a restart" />
      </Step>
      <Step>
        <div style={{ position: 'absolute', left: 0, top: 270, width: 1000 }}>
          <Code>
            <Cm># human_input node</Cm>
            {'\n'}decision = <F>interrupt</F>({'{'}
            <S>"kind"</S>: <S>"plan_approval"</S>, ...{'}'}){'\n'}
            <Cm># → graph stops, checkpoint saved, worker moves on</Cm>
            {'\n\n'}
            <Cm># later: /agent approve arrives as a webhook</Cm>
            {'\n'}
            <K>await</K> graph.<F>ainvoke</F>({'\n'}
            {'    '}
            <F>Command</F>(resume={'{'}
            <S>"action"</S>: <S>"approve"</S>
            {'}'}),{'\n'}
            {'    '}
            {'{'}
            <S>"configurable"</S>: {'{'}
            <S>"thread_id"</S>: run_id{'}}'},{'\n'})
          </Code>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 1080,
            top: 290,
            width: 600,
            fontSize: 30,
            lineHeight: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <Bullet>One thread per run</Bullet>
          <Bullet>Survives server restarts</Bullet>
          <Bullet>No process waits for a human</Bullet>
        </div>
      </Step>
    </Steps>
  </Slide>
);

// --- 09 · The state graph ---

const Node = (props: BoxProps) => <Box h={90} monoTitle {...props} />;

const StateGraph: Page = () => (
  <Slide eyebrow="the state graph" title="Two lanes, ten nodes">
    <Zone x={0} y={0} w={1680} h={360} kind="core" label="1 · Issue → Pull Request" />
    <Node x={30} y={200} w={200} kind="github" title="load_issue" />
    <Node x={290} y={200} w={230} kind="core" title="plan_with_pi" />
    <Node x={590} y={60} w={260} kind="human" title="human_input" sub="waits for you" strong />
    <Node x={900} y={200} w={280} kind="sandbox" title="implement_with_pi" />
    <Node x={1240} y={200} w={170} kind="ok" title="verify" />
    <Node x={1460} y={200} w={200} kind="github" title="publish_pr" />

    <Arrow pts={[[230, 245], [290, 245]]} />
    <Arrow pts={[[405, 200], [405, 105], [590, 105]]} color={c.amber} label="complex / question" at={[300, 140]} />
    <Arrow pts={[[590, 135], [470, 135], [470, 200]]} color={c.amber} label="reject / answer" at={[470, 168]} />
    <Arrow pts={[[850, 105], [1040, 105], [1040, 200]]} color={c.amber} label="approve" at={[945, 105]} />
    <Arrow pts={[[520, 245], [900, 245]]} color={c.lime} width={3} label="simple plan (auto)" at={[710, 245]} />
    <Arrow pts={[[930, 200], [930, 135], [850, 135]]} color={c.amber} />
    <Label x={890} y={172} color={c.amber}>
      needs_input
    </Label>
    <Arrow pts={[[1180, 245], [1240, 245]]} />
    <Arrow
      pts={[[1325, 290], [1325, 322], [1040, 322], [1040, 290]]}
      color={c.danger}
      label="fail → retry ≤3"
      at={[1182, 322]}
    />
    <Arrow pts={[[1410, 245], [1460, 245]]} color={c.success} />

    <Steps>
      <Step>
        <Caption x={1180} y={60} color={c.lime}>
          simple: no human in the loop
        </Caption>
        <Packet
          pts={[[130, 245], [405, 245], [1040, 245], [1325, 245], [1560, 245]]}
          color={c.lime}
          label="run"
          dur={2.6}
        />
      </Step>
      <Step>
        <Caption x={1180} y={110} color={c.amber}>
          complex: pauses for approval
        </Caption>
        <Packet
          pts={[[130, 245], [405, 245], [405, 105], [720, 105], [1040, 105], [1040, 245], [1325, 245], [1560, 245]]}
          color={c.amber}
          label="run"
          dur={3.6}
        />
      </Step>
      <Step>
        <Zone x={260} y={430} w={1420} h={240} kind="github" label="2 · Review → new commit, every review round" />
        <Node x={300} y={490} w={200} kind="github" title="review" />
        <Node x={580} y={490} w={300} kind="sandbox" title="implement_review" />
        <Node x={960} y={490} w={170} kind="ok" title="verify" />
        <Node x={1210} y={490} w={230} kind="github" title="push_review" />
        <Arrow pts={[[500, 535], [580, 535]]} />
        <Arrow pts={[[880, 535], [960, 535]]} />
        <Arrow pts={[[1130, 535], [1210, 535]]} color={c.success} />
        <Arrow pts={[[1045, 580], [1045, 625], [730, 625], [730, 580]]} color={c.danger} label="fail → retry" at={[888, 625]} />
        <Arrow
          pts={[[1560, 290], [1560, 395], [220, 395], [220, 535], [300, 535]]}
          dashed
          color={c.cyan}
          label="PR review arrives"
          at={[980, 395]}
        />
        <Caption x={1180} y={160} color={c.cyan}>
          review: same loop, new commit
        </Caption>
        <Packet
          pts={[[1560, 290], [1560, 395], [220, 395], [220, 535], [1045, 535], [1325, 535]]}
          color={c.cyan}
          label="review"
          dur={3.4}
        />
      </Step>
    </Steps>
  </Slide>
);

// --- 10 · The real graph ---

const RealGraph: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '96px 120px 0',
    }}
  >
    <div style={{ width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Eyebrow>the real thing</Eyebrow>
      <Heading>
        Same graph,
        <br />
        drawn by the code
      </Heading>
      <div style={{ marginTop: 32 }}>
        <Code size={22}>
          builder.<F>add_node</F>(<S>"verify"</S>, self.verify){'\n'}
          builder.<F>add_conditional_edges</F>({'\n'}
          {'  '}
          <S>"verify"</S>, self.after_verify,{'\n'}
          {'  {'}
          <S>"publish"</S>: <S>"publish_pr"</S>,{'\n'}
          {'   '}
          <S>"retry"</S>: <S>"implement_with_pi"</S>
          {'}'},{'\n'})
        </Code>
      </div>
      <div style={{ marginTop: 24, fontSize: 30, lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Bullet>10 nodes, one typed state</Bullet>
        <Bullet>Edges are plain Python functions</Bullet>
        <Bullet>
          Served live at <span style={{ fontFamily: mono, color: c.lime }}>/graph</span>
        </Bullet>
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        right: 120,
        top: 96,
        background: '#ffffff',
        borderRadius: 'var(--osd-radius)',
        padding: 16,
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
      }}
    >
      <img src={langgraphPng} alt="The graph as LangGraph draws it" style={{ display: 'block', height: 820 }} />
    </div>
    <Footer />
  </div>
);

// --- 11 · The fix loop and structured results ---

const Counter = ({ children, color }: { children: ReactNode; color: string }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 520,
      height: 70,
      background: c.bg,
      fontFamily: mono,
      fontSize: 36,
      color,
      zIndex: 3,
    }}
  >
    {children}
  </div>
);

const FixLoop: Page = () => (
  <Slide eyebrow="verify" title="Don't trust. Verify, then retry.">
    <Counter color={c.text}>attempt 1 / 3</Counter>
    <Box x={0} y={140} w={260} h={120} kind="sandbox" tag="pi" title="Implement" sub="attempt N" />
    <Box x={360} y={140} w={220} h={120} kind="core" tag="server" title="Verify" sub="lint · build" strong />
    <Box x={680} y={140} w={240} h={120} kind="ok" tag="pass" title="Publish PR" />
    <Box x={180} y={400} w={320} h={120} kind="human" tag="N < 3" title="Feed the error back" sub="failing output → Pi" />
    <Box x={680} y={400} w={240} h={120} kind="bad" tag="N = 3" title="Finish: failed" />
    <Arrow pts={[[260, 200], [360, 200]]} />
    <Arrow pts={[[580, 200], [680, 200]]} color={c.success} />
    <Arrow pts={[[440, 260], [440, 400]]} color={c.danger} label="fail" at={[440, 330]} />
    <Arrow pts={[[180, 460], [100, 460], [100, 260]]} color={c.amber} label="retry" at={[100, 360]} />
    <Arrow pts={[[540, 260], [540, 460], [680, 460]]} color={c.danger} />
    <p style={{ position: 'absolute', left: 0, top: 580, width: 920, margin: 0, fontSize: 28, color: c.muted, lineHeight: 1.5 }}>
      What Pi <em>claims</em> it checked doesn't count.
    </p>

    <div style={{ position: 'absolute', left: 1000, top: 0, width: 680 }}>
      <div style={{ fontFamily: mono, fontSize: 22, color: c.lime, marginBottom: 16 }}>
        {'// submit_result: Pi answers in a schema'}
      </div>
      <Code size={22}>
        pi.<F>registerTool</F>({'{'}
        {'\n'}
        {'  '}name: <S>"submit_result"</S>,{'\n'}
        {'  '}parameters: Type.<F>Object</F>({'{'}
        {'\n'}
        {'    '}status: <S>"ready"</S> | <S>"needs_input"</S>
        {'\n'}
        {'          '}| <S>"completed"</S> | <S>"failed"</S>,{'\n'}
        {'    '}summary: Type.<F>String</F>(),{'\n'}
        {'    '}plan: Type.<F>Array</F>(Type.<F>String</F>()),{'\n'}
        {'    '}questions: Type.<F>Array</F>(...),{'\n'}
        {'    '}complexity: <S>"simple"</S> | <S>"complex"</S>,{'\n'}
        {'  '}
        {'}'}),{'\n'}
        {'  '}
        <Cm>// terminate: true → no extra LLM turn</Cm>
        {'\n'}
        {'}'})
      </Code>
    </div>

    <Steps>
      <Step>
        <Counter color={c.amber}>attempt 2 / 3</Counter>
        <Packet pts={[[470, 200], [440, 330], [440, 460], [100, 460], [100, 200]]} color={c.danger} label="lint failed" dur={2.6} />
      </Step>
      <Step>
        <Counter color={c.success}>passed on attempt 2</Counter>
        <Packet pts={[[130, 200], [470, 200], [800, 200]]} color={c.success} label="green" dur={1.8} />
      </Step>
    </Steps>
  </Slide>
);

// --- 12 · Security ---

const Security: Page = () => (
  <Slide eyebrow="security" title="The agent never sees a key">
    <Zone x={0} y={40} w={520} h={460} kind="sandbox" label="Cloud sandbox" />
    <Box x={40} y={110} w={440} h={250} kind="sandbox" tag="pi" title="Pi coding agent">
      <div style={{ fontFamily: mono, fontSize: 21, color: c.muted, lineHeight: 1.7, marginTop: 12 }}>
        <div>
          GH_TOKEN=<span style={{ color: c.coral }}>placeholder</span>
        </div>
        <div>
          OPENROUTER_KEY=<span style={{ color: c.coral }}>placeholder</span>
        </div>
      </div>
    </Box>

    <Zone x={640} y={40} w={480} h={460} kind="ext" label="Docker cloud" />
    <Box x={680} y={110} w={400} h={110} kind="secure" tag="egress proxy" title="Swaps in the real key" strong />
    <Box x={680} y={330} w={400} h={110} kind="ext" tag="secret store" title="github · openrouter" />
    <Arrow pts={[[880, 330], [880, 220]]} color={c.coral} label="real value" at={[880, 275]} />

    <Box x={1260} y={60} w={420} h={100} kind="ok" tag="allowed" title="openrouter.ai" />
    <Box x={1260} y={200} w={420} h={100} kind="ok" tag="allowed" title="github.com" />
    <Box x={1260} y={380} w={420} h={100} kind="bad" tag="deny-all" title="anything else ✗" />

    <Arrow pts={[[480, 165], [680, 165]]} label="request" at={[580, 135]} />
    <Arrow pts={[[1080, 145], [1170, 145], [1170, 110], [1260, 110]]} color={c.success} />
    <Arrow pts={[[1080, 185], [1170, 185], [1170, 250], [1260, 250]]} color={c.success} />
    <Arrow pts={[[1080, 205], [1130, 205], [1130, 430], [1260, 430]]} dashed color={c.danger} label="blocked" at={[1130, 330]} />

    <Steps>
      <Step>
        <Packet pts={[[260, 165], [870, 165]]} color={c.coral} label="placeholder" dur={1.6} />
      </Step>
      <Step>
        <Packet pts={[[880, 185], [1170, 185], [1170, 250], [1420, 250]]} color={c.lime} label="real token" dur={1.6} />
      </Step>
      <Step>
        <Packet pts={[[260, 240], [600, 240], [880, 205], [1130, 205], [1130, 430], [1200, 430]]} color={c.danger} label="evil.com" dur={2.4} />
      </Step>
      <Step>
        <Box
          x={0}
          y={560}
          w={1680}
          h={100}
          kind="core"
          tag="server .env"
          title={
            <span style={{ fontWeight: 500, fontSize: 26 }}>
              GITHUB_TOKEN and the webhook secret stay on the server. They open the PR; Pi never gets them.
            </span>
          }
        />
      </Step>
    </Steps>
  </Slide>
);

// --- 13 · The recipe ---

const Recipe = ({ n, verb, title, used }: { n: string; verb: string; title: string; used: string }) => (
  <div
    style={{
      height: 220,
      boxSizing: 'border-box',
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 22, color: c.lime }}>
      {n} · {verb}
    </div>
    <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.25 }}>{title}</div>
    <div style={{ marginTop: 'auto', fontFamily: mono, fontSize: 20, color: c.muted }}>{used}</div>
  </div>
);

const RecipePage: Page = () => {
  const command = 'git clone github.com/NetanelRotem/agent-demo-taskboard';
  return (
    <Slide eyebrow="your turn" title="The recipe: six boxes">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
        <Steps>
          <Step>
            <Recipe n="01" verb="listen" title="Catch the Issue comment" used="FastAPI + HMAC webhook" />
          </Step>
          <Step>
            <Recipe n="02" verb="remember" title="A state machine that can pause" used="LangGraph + SQLite" />
          </Step>
          <Step>
            <Recipe n="03" verb="code" title="A headless coding agent" used="Pi + OpenRouter + a schema" />
          </Step>
          <Step>
            <Recipe n="04" verb="isolate" title="A sandbox with no secrets" used="Docker Cloud Sandboxes" />
          </Step>
          <Step>
            <Recipe n="05" verb="verify" title="Run the checks yourself" used="lint + build, push on green" />
          </Step>
          <Step>
            <Recipe n="06" verb="watch" title="See every run and its cost" used="dashboard · Telegram · Langfuse" />
          </Step>
        </Steps>
      </div>
      <Steps>
        <Step>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 540,
              display: 'flex',
              alignItems: 'center',
              fontFamily: mono,
              fontSize: 30,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: c.muted, marginRight: 18 }}>$</span>
            <span
              className="lg-type-step"
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
              style={{ display: 'inline-block', width: 16, height: 34, marginLeft: 6, background: c.lime }}
            />
          </div>
        </Step>
      </Steps>
    </Slide>
  );
};

// --- Transitions: RISE for the deck, BREATH into the demo break (DESIGN.MD › Motion) ---

const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
export const transition: SlideTransition = {
  duration: 200,
  exit: { duration: 140, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 200,
    easing: EASE,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

Demo.transition = {
  duration: 460,
  throughBackground: true,
  exit: { duration: 180, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 0 }] },
  enter: {
    duration: 240,
    delay: 300,
    easing: EASE,
    keyframes: [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'Build Your Own Coding Agent Factory',
  createdAt: '2026-10-19T12:35:44.348Z',
};

export const notes: (string | undefined)[] = [
  `Open with the promise: you write an Issue, the agent hands back a Pull Request.
Let the terminal finish typing before you speak.`,
  `Three boxes, left to right. The point: nobody leaves GitHub.`,
  `One card per click. These three rules shape every box in the architecture later.`,
  `First click: a simple change goes straight to code. Second click: a complex one stops at a person.`,
  `Switch to the live demo here. Show the Issue, the comment, then the dashboard.`,
  `Four layers, left to right. For each box, say what you could swap in.`,
  `Build it zone by zone. Last click: follow one comment all the way through and back as a PR.`,
  `The key idea: a run waits for a person without any process waiting. interrupt() and resume.`,
  `Click 1: simple path. Click 2: the approval path. Click 3: the review lane.`,
  `This is not a slide drawing. LangGraph draws it from the code, and /graph shows it live.`,
  `The server runs the checks itself. A failure goes back to Pi with the error, up to three tries.`,
  `Placeholder in, real key out at the proxy. Anything not on the list is blocked.`,
  `Six boxes. Each one has an alternative. Close with the repo link.`,
];

export default [
  Cover,
  Idea,
  Principles,
  UserFlow,
  Demo,
  Stack,
  Architecture,
  LangGraphWhy,
  StateGraph,
  RealGraph,
  FixLoop,
  Security,
  RecipePage,
] satisfies Page[];
