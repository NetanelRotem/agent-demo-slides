import { type DesignSystem, type Page, type SlideMeta, useSlidePageNumber } from '@open-slide/core';
import type { ReactNode } from 'react';

// LinkedIn carousel in the Lime on Graphite design (see DESIGN.MD).
// Static by design: no steps, no transitions, no keyframes, so the PDF export
// matches the screen. Every page draws a 4:5 portrait frame (864 × 1080) in the
// middle of the 1920 × 1080 canvas; crop the exported PDF to that frame.

export const design: DesignSystem = {
  palette: { bg: '#16181d', text: '#edede8', accent: '#c8f135' },
  fonts: {
    display: "'Secular One', 'Heebo', sans-serif",
    body: "'Heebo', system-ui, sans-serif",
  },
  typeScale: { hero: 92, body: 34 },
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

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&family=Secular+One&display=swap';
const FONT_LINK_ID = 'osd-webfont-linkedin-carousel';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

// --- Portrait frame ---

const FRAME_W = 864;
const FRAME_X = (1920 - FRAME_W) / 2;
const PAD_X = 64;

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: FRAME_X + PAD_X,
        width: FRAME_W - 2 * PAD_X,
        bottom: 44,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: mono,
        fontSize: 22,
        color: c.muted,
      }}
    >
      <span style={{ color: c.lime }}>{'// Netanel Rotem'}</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
        {current < total && <span style={{ color: c.text, marginLeft: 20 }}>swipe →</span>}
      </span>
    </div>
  );
};

// Faint guides on the frame edges, outside the crop.
const CropGuide = ({ x }: { x: number }) => (
  <div style={{ position: 'absolute', left: x, top: 0, width: 1, height: '100%', background: 'rgba(237, 237, 232, 0.08)' }} />
);

const Frame = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    <CropGuide x={FRAME_X - 1} />
    <CropGuide x={FRAME_X + FRAME_W} />
    <div
      style={{
        position: 'absolute',
        left: FRAME_X,
        top: 0,
        width: FRAME_W,
        height: 1080,
        boxSizing: 'border-box',
        padding: `64px ${PAD_X}px 104px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 28,
      }}
    >
      {children}
    </div>
    <Footer />
  </div>
);

// --- Shared pieces (DESIGN.MD components, static) ---

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: mono, fontSize: 24, letterSpacing: '0.12em', color: c.lime }}>
    {'// '}
    {children}
  </div>
);

const Heading = ({ children }: { children: ReactNode }) => (
  <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 60, fontWeight: 400, lineHeight: 1.12, margin: 0 }}>
    {children}
  </h2>
);

const Head = ({ eyebrow, children }: { eyebrow: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <Heading>{children}</Heading>
  </div>
);

const Lead = ({ children }: { children: ReactNode }) => (
  <p style={{ margin: 0, fontSize: 30, color: c.muted, lineHeight: 1.45 }}>{children}</p>
);

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

const Box = ({
  kind,
  tag,
  title,
  sub,
  strong,
  titleSize = 32,
  flex,
  children,
}: {
  kind: Kind;
  tag?: string;
  title: ReactNode;
  sub?: ReactNode;
  strong?: boolean;
  titleSize?: number;
  flex?: number;
  children?: ReactNode;
}) => {
  const color = kindColor[kind];
  return (
    <div
      style={{
        flex,
        minWidth: 0,
        boxSizing: 'border-box',
        background: strong ? `color-mix(in srgb, ${color} 9%, ${c.surface})` : c.surface,
        border: `1px solid ${strong ? color : `${color}59`}`,
        borderRadius: 'var(--osd-radius)',
        padding: '16px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {tag && <div style={{ fontFamily: mono, fontSize: 20, color, lineHeight: 1.3 }}>{tag}</div>}
      <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
      {sub && <div style={{ fontSize: 23, color: c.muted, lineHeight: 1.35 }}>{sub}</div>}
      {children}
    </div>
  );
};

const Row = ({ children, gap = 14 }: { children: ReactNode; gap?: number }) => (
  <div style={{ display: 'flex', alignItems: 'stretch', gap }}>{children}</div>
);

const Zone = ({ kind, label, children }: { kind: Kind; label: string; children: ReactNode }) => (
  <div
    style={{
      border: `1.5px dashed ${kindColor[kind]}66`,
      borderRadius: 16,
      padding: '12px 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 20, color: kindColor[kind] }}>{label}</div>
    {children}
  </div>
);

// A vertical arrow with an optional label beside it.
const Down = ({ label, color = c.muted, h = 40 }: { label?: string; color?: string; h?: number }) => (
  <div style={{ position: 'relative', height: h }}>
    <svg width={16} height={h} style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -8 }}>
      <line x1={8} y1={0} x2={8} y2={h - 10} stroke={color} strokeWidth={2} />
      <polygon points={`2,${h - 12} 14,${h - 12} 8,${h}`} fill={color} />
    </svg>
    {label && (
      <span
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: 22,
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: mono,
          fontSize: 20,
          color,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    )}
  </div>
);

const Right = ({ color = c.muted }: { color?: string }) => (
  <svg width={36} height={16} style={{ alignSelf: 'center', flexShrink: 0 }}>
    <line x1={0} y1={8} x2={26} y2={8} stroke={color} strokeWidth={2} />
    <polygon points="24,2 24,14 36,8" fill={color} />
  </svg>
);

const Bullet = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, fontSize: 30, lineHeight: 1.4 }}>
    <span style={{ color: c.lime, fontFamily: mono }}>→</span>
    <span>{children}</span>
  </div>
);

// --- 01 · Cover ---

const Cover: Page = () => (
  <Frame>
    <Eyebrow>build it yourself</Eyebrow>
    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 400,
        lineHeight: 1.05,
        margin: 0,
      }}
    >
      Build your own
      <br />
      Coding Agent
      <br />
      <span style={{ color: c.lime }}>Factory</span>
    </h1>
    <Lead>Write a GitHub Issue. Get back a tested Pull Request. The architecture, box by box.</Lead>
    <div
      style={{
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 'var(--osd-radius)',
        padding: '24px 32px',
        fontFamily: mono,
        fontSize: 28,
        lineHeight: 1.8,
        marginTop: 8,
      }}
    >
      <div>
        <span style={{ color: c.muted }}>$ </span>
        <span style={{ color: c.cyan }}>/agent start</span>
      </div>
      <div>
        <span style={{ color: c.success }}>✓</span> plan <span style={{ color: c.muted }}>· 4 steps · simple</span>
      </div>
      <div>
        <span style={{ color: c.success }}>✓</span> verify <span style={{ color: c.muted }}>· lint · build</span>
      </div>
      <div style={{ color: c.lime }}>
        → PR #13 <span style={{ color: c.violet }}>ready for review</span>
      </div>
    </div>
  </Frame>
);

// --- 02 · The idea ---

const Idea: Page = () => (
  <Frame>
    <Head eyebrow="the idea">Issue in. Pull Request out.</Head>
    <Box kind="github" tag="01 · the task" title="Issue" sub="What to build, in plain English." titleSize={44} />
    <Down color={c.lime} />
    <Box
      kind="core"
      tag="02 · the conversation"
      title="Comments"
      sub="/agent start, approve, answer. Right on the Issue."
      titleSize={44}
    />
    <Down color={c.lime} />
    <Box kind="ok" tag="03 · the output" title="Pull Request" sub="Tested code, reviewed like any other PR." titleSize={44} />
    <Lead>
      No new tool to learn. <span style={{ color: c.text }}>It lives where the team already works.</span>
    </Lead>
  </Frame>
);

// --- 03 · Three rules ---

const Rule = ({ n, title, body, how }: { n: string; title: string; body: string; how: string }) => (
  <div
    style={{
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: '22px 28px',
      display: 'flex',
      gap: 24,
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 36, color: c.lime, lineHeight: 1.2 }}>{n}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 38, lineHeight: 1.15 }}>{title}</div>
      <div style={{ fontSize: 26, color: c.muted, lineHeight: 1.4 }}>{body}</div>
      <div style={{ fontFamily: mono, fontSize: 20, color: c.cyan, marginTop: 4 }}>{how}</div>
    </div>
  </div>
);

const Rules: Page = () => (
  <Frame>
    <Head eyebrow="principles">Three rules the factory runs on</Head>
    <Rule
      n="01"
      title="People decide, the agent executes"
      body="A person approves complex plans and reviews every PR."
      how="approve · review · manual merge"
    />
    <Rule
      n="02"
      title="The agent gets no keys"
      body="It codes in a cloud sandbox. Secrets are added outside, at the network."
      how="placeholder → proxy → real key"
    />
    <Rule n="03" title="Checks, not promises" body="The server runs lint and build itself. No green, no PR." how="npm run lint · npm run build" />
  </Frame>
);

// --- 04 · The flow ---

const Step = ({ kind, tag, title }: { kind: Kind; tag: string; title: string }) => (
  <Box kind={kind} tag={tag} title={title} titleSize={30} flex={1} />
);

const Flow: Page = () => (
  <Frame>
    <Head eyebrow="the flow">What the user sees</Head>
    <Row>
      <Step kind="github" tag="github" title="Issue" />
      <Right />
      <Step kind="core" tag="agent" title="Plan" />
    </Row>
    <Row gap={20}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: mono, fontSize: 21, color: c.lime }}>simple</span>
        <div style={{ width: 2, height: 60, background: c.lime }} />
        <span style={{ fontFamily: mono, fontSize: 20, color: c.muted }}>straight to code</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
        <span style={{ fontFamily: mono, fontSize: 21, color: c.amber, textAlign: 'center' }}>complex</span>
        <Box kind="human" tag="human" title="Approve?" titleSize={28} />
      </div>
    </Row>
    <Down />
    <Row>
      <Step kind="sandbox" tag="sandbox" title="Code" />
      <Right />
      <Box kind="core" tag="server" title="Checks" titleSize={30} flex={1} sub="fail → retry ≤3" />
    </Row>
    <Down color={c.success} label="pass" />
    <Row>
      <Step kind="github" tag="github" title="PR" />
      <Right />
      <Step kind="human" tag="human" title="Review" />
      <Right color={c.success} />
      <Step kind="ok" tag="merge" title="Live" />
    </Row>
  </Frame>
);

// --- 05 · Architecture ---

const Mini = ({ kind, tag, title, strong }: { kind: Kind; tag: string; title: string; strong?: boolean }) => (
  <Box kind={kind} tag={tag} title={title} titleSize={25} flex={1} strong={strong} />
);

const Architecture: Page = () => (
  <Frame>
    <Head eyebrow="architecture">Three zones, one proxy</Head>
    <Zone kind="github" label="GitHub">
      <Row>
        <Mini kind="github" tag="trigger" title="Issues" />
        <Mini kind="github" tag="output" title="Pull requests" />
      </Row>
    </Zone>
    <Down color={c.cyan} label="webhook in · comments + PR out" h={36} />
    <Zone kind="core" label="Server · FastAPI · your laptop or a VM">
      <Row>
        <Mini kind="core" tag="main.py" title="Webhook" />
        <Mini kind="core" tag="service.py" title="Queue" />
        <Mini kind="core" tag="agent_graph.py" title="LangGraph" strong />
      </Row>
      <Row>
        <Mini kind="core" tag="pi_runner.py" title="Pi runner" />
        <Mini kind="core" tag="workspace.py" title="Verify, push" />
        <Mini kind="ext" tag="storage.py" title="SQLite" />
      </Row>
    </Zone>
    <Down color={c.violet} label="sbx exec" h={36} />
    <Zone kind="sandbox" label="Cloud sandbox · one per run">
      <Row>
        <Mini kind="sandbox" tag="agent.sh" title="Clone, push" />
        <Mini kind="sandbox" tag="pi" title="Pi agent" />
        <Mini kind="secure" tag="proxy" title="Adds keys" strong />
      </Row>
    </Zone>
    <div style={{ fontFamily: mono, fontSize: 20, color: c.amber, textAlign: 'center' }}>
      observe: dashboard · Telegram · Langfuse
    </div>
  </Frame>
);

// --- 06 · The building blocks ---

const Layer = ({ n, name, kind, tools, alt }: { n: string; name: string; kind: Kind; tools: string; alt: string }) => (
  <Box kind={kind} tag={`${n} · ${name}`} title={tools} sub={`alt: ${alt}`} titleSize={30} />
);

const Blocks: Page = () => (
  <Frame>
    <Head eyebrow="the stack">The building blocks, and what to swap in</Head>
    <Layer n="01" name="receive" kind="github" tools="GitHub webhooks + FastAPI" alt="GitLab, Jira · Express, Flask" />
    <Layer n="02" name="orchestrate" kind="core" tools="LangGraph + SQLite" alt="Temporal, a states table · Postgres" />
    <Layer
      n="03"
      name="execute"
      kind="sandbox"
      tools="Pi + OpenRouter + Docker Sandboxes"
      alt="Claude Code, Codex · any LLM · E2B"
    />
    <Layer n="04" name="observe" kind="human" tools="Dashboard + Telegram + Langfuse" alt="Grafana · Slack · LangSmith" />
  </Frame>
);

// --- 07 · Why LangGraph ---

const Pause: Page = () => (
  <Frame>
    <Head eyebrow="why langgraph">A run can wait for days</Head>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box kind="core" tag="node" title="plan_with_pi" titleSize={30} />
      <Down h={26} />
      <Box kind="human" tag="interrupt()" title="Pause" sub="state saved to SQLite, worker freed" titleSize={30} strong />
      <Down h={26} />
      <Box kind="ext" tag="hours … days" title="Nothing runs" sub="sandbox stopped, costs $0" titleSize={30} />
      <Down h={26} />
      <Box kind="github" tag="webhook" title="/agent approve" titleSize={30} />
      <Down h={26} color={c.lime} />
      <Box kind="core" tag="Command(resume=…)" title="Continue, even after a restart" titleSize={30} />
    </div>
  </Frame>
);

// --- 08 · Verify ---

const Verify: Page = () => (
  <Frame>
    <Head eyebrow="verify">Don't trust. Verify, then retry.</Head>
    <Box kind="sandbox" tag="pi" title="Implement" sub="attempt N" titleSize={32} />
    <Down />
    <Box kind="core" tag="server" title="Verify" sub="npm run lint · npm run build" titleSize={32} strong />
    <Row gap={20}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Down color={c.success} label="pass" />
        <Box kind="ok" tag="github" title="Publish PR" titleSize={30} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Down color={c.danger} label="fail" />
        <Box kind="human" tag="N < 3" title="Error back to Pi" sub="then implement again" titleSize={30} />
      </div>
    </Row>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
      <Bullet>Pi answers through a schema tool, not free text</Bullet>
      <Bullet>What Pi claims it checked doesn't count</Bullet>
    </div>
  </Frame>
);

// --- 09 · Security ---

const Security: Page = () => (
  <Frame>
    <Head eyebrow="security">The agent never sees a key</Head>
    <Zone kind="sandbox" label="Cloud sandbox">
      <Box kind="sandbox" tag="pi" title="Pi coding agent" titleSize={30}>
        <div style={{ fontFamily: mono, fontSize: 21, color: c.muted, lineHeight: 1.6, marginTop: 6 }}>
          GH_TOKEN=<span style={{ color: c.coral }}>placeholder</span>
          <br />
          OPENROUTER_KEY=<span style={{ color: c.coral }}>placeholder</span>
        </div>
      </Box>
    </Zone>
    <Down label="request + placeholder" />
    <Box kind="secure" tag="egress proxy · Docker cloud" title="Swaps in the real key" sub="from the secret store, outside the sandbox" titleSize={30} strong />
    <Row gap={20}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Down color={c.success} label="allowed" />
        <Box kind="ok" tag="allow-list" title="openrouter.ai github.com" titleSize={26} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Down color={c.danger} label="deny-all" />
        <Box kind="bad" tag="blocked" title="anything else ✗" titleSize={26} />
      </div>
    </Row>
    <div style={{ fontFamily: mono, fontSize: 21, color: c.muted }}>
      GITHUB_TOKEN stays on the server · Pi never gets it
    </div>
  </Frame>
);

// --- 10 · By the numbers ---

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div
    style={{
      flex: 1,
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: '26px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 84, lineHeight: 1, color: c.lime }}>{value}</div>
    <div style={{ fontSize: 26, color: c.muted, lineHeight: 1.35 }}>{label}</div>
  </div>
);

const Numbers: Page = () => (
  <Frame>
    <Head eyebrow="by the numbers">One real run, Issue #12</Head>
    <Lead>"Keep todos after a page refresh"</Lead>
    <Row gap={20}>
      <Stat value="96 s" label="from /agent start to an open PR" />
      <Stat value="$0.04" label="plan + code + one review round" />
    </Row>
    <Row gap={20}>
      <Stat value="19" label="tool calls by Pi" />
      <Stat value="0" label="approvals needed: a simple plan" />
    </Row>
    <div style={{ fontFamily: mono, fontSize: 24, color: c.text, marginTop: 8 }}>
      all runs so far: <span style={{ color: c.lime }}>8</span> runs · <span style={{ color: c.lime }}>5</span> PRs ·{' '}
      <span style={{ color: c.lime }}>$1.04</span>
    </div>
  </Frame>
);

// --- 11 · The recipe ---

const Recipe = ({ n, verb, title, used }: { n: string; verb: string; title: string; used: string }) => (
  <div
    style={{
      flex: 1,
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: '18px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 20, color: c.lime }}>
      {n} · {verb}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
    <div style={{ fontFamily: mono, fontSize: 18, color: c.muted, marginTop: 'auto' }}>{used}</div>
  </div>
);

const RecipePage: Page = () => (
  <Frame>
    <Head eyebrow="your turn">The recipe: six boxes</Head>
    <Row>
      <Recipe n="01" verb="listen" title="Catch the Issue comment" used="FastAPI + HMAC" />
      <Recipe n="02" verb="remember" title="A state machine that can pause" used="LangGraph + SQLite" />
    </Row>
    <Row>
      <Recipe n="03" verb="code" title="A headless coding agent" used="Pi + OpenRouter" />
      <Recipe n="04" verb="isolate" title="A sandbox with no secrets" used="Docker Sandboxes" />
    </Row>
    <Row>
      <Recipe n="05" verb="verify" title="Run the checks yourself" used="lint + build" />
      <Recipe n="06" verb="watch" title="See every run and its cost" used="dashboard · Telegram" />
    </Row>
    <div style={{ fontFamily: mono, fontSize: 23, color: c.cyan, marginTop: 8 }}>
      github.com/NetanelRotem/agent-demo-taskboard
    </div>
  </Frame>
);

export const meta: SlideMeta = {
  title: 'LinkedIn Carousel: Coding Agent Factory',
  createdAt: '2026-10-19T13:34:50.317Z',
};

export default [
  Cover,
  Idea,
  Rules,
  Flow,
  Architecture,
  Blocks,
  Pause,
  Verify,
  Security,
  Numbers,
  RecipePage,
] satisfies Page[];
