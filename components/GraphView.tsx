"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import type { GraphRing } from "@/lib/types";

interface CenterNode {
  label: string;
  href?: string;
}

const COLORS: Record<string, { fill: string; stroke: string }> = {
  technology: { fill: "rgba(183,243,74,0.14)", stroke: "var(--color-accent)" },
  concept: { fill: "rgba(93,226,231,0.14)", stroke: "var(--color-cyan)" },
  feature: { fill: "var(--color-elevated)", stroke: "var(--color-muted-dim)" },
  project: { fill: "var(--color-elevated)", stroke: "var(--color-muted)" },
  default: { fill: "var(--color-accent)", stroke: "var(--color-accent)" },
};

function polarPos(cx: number, cy: number, r: number, i: number, n: number, offset = 0) {
  const angle = offset + (i / n) * Math.PI * 2 - Math.PI / 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function hexPoints(x: number, y: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${x + r * Math.cos(a)},${y + r * Math.sin(a)}`);
  }
  return pts.join(" ");
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function GraphView({
  center,
  rings,
  height = 420,
  mobileHeight = 320,
  hrefForType,
}: {
  center: CenterNode;
  rings: GraphRing[];
  height?: number;
  mobileHeight?: number;
  /** Base path per node type, e.g. { technology: "/technologies" }. A type with no entry renders unlinked. */
  hrefForType: Partial<Record<string, string>>;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [revealCount, setRevealCount] = useState(0);
  const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [prevCenterLabel, setPrevCenterLabel] = useState(center.label);
  const dragState = useRef<{ startX: number; startY: number; origTx: number; origTy: number } | null>(null);
  const didDragRef = useRef(false);

  // Reset pan/zoom/reveal synchronously during render when the graph's
  // subject changes (navigating to a new project/technology), rather than
  // in an effect — this is the "adjusting state on prop change" pattern.
  if (center.label !== prevCenterLabel) {
    setPrevCenterLabel(center.label);
    setRevealCount(0);
    setView({ scale: 1, tx: 0, ty: 0 });
  }

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Progressive reveal: technologies, then concepts, then features.
  // The effect only schedules async callbacks — it never calls setState
  // synchronously in the effect body itself.
  useEffect(() => {
    const timers = rings.map((_, i) =>
      setTimeout(() => setRevealCount((c) => Math.max(c, i + 1)), 140 * i + 80)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.label]);

  const svgH = isMobile ? Math.min(height, mobileHeight) : height;
  const W = 720;
  const H = svgH;
  const cx = W / 2;
  const cy = H / 2;
  const nodeSize = isMobile ? 12 : 15;
  const fontSize = isMobile ? 9.5 : 11;

  const clampScale = (s: number) => Math.min(2.4, Math.max(0.6, s));

  const onWheel: React.WheelEventHandler<SVGSVGElement> = (e) => {
    if (isMobile) return;
    e.preventDefault();
    setView((v) => ({ ...v, scale: clampScale(v.scale - e.deltaY * 0.001) }));
  };
  const onPointerDown: React.PointerEventHandler<SVGSVGElement> = (e) => {
    dragState.current = { startX: e.clientX, startY: e.clientY, origTx: view.tx, origTy: view.ty };
    didDragRef.current = false;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return; // Early return if not dragging

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDragRef.current = true;
    }

    //  Read values into local constants before entering the React state updater
    const { origTx, origTy } = dragState.current;

    setView((v) => ({
      ...v,
      tx: origTx + dx,
      ty: origTy + dy,
    }));
  };
  const onPointerUp = () => {
    dragState.current = null;
    setIsDragging(false);
  };

  const zoomBtn = (delta: number) => setView((v) => ({ ...v, scale: clampScale(v.scale + delta) }));
  const resetView = () => setView({ scale: 1, tx: 0, ty: 0 });

  const go = (href: string | null) => {
    if (!href || didDragRef.current) return;
    window.location.href = href;
  };

  return (
    <div className="w-full overflow-hidden relative bg-surface border border-border rounded-2xl">
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <GraphCtrlBtn onClick={() => zoomBtn(0.25)} label="Zoom in"><Plus size={13} /></GraphCtrlBtn>
        <GraphCtrlBtn onClick={() => zoomBtn(-0.25)} label="Zoom out"><Minus size={13} /></GraphCtrlBtn>
        <GraphCtrlBtn onClick={resetView} label="Reset view"><RotateCcw size={12} /></GraphCtrlBtn>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={svgH}
        style={{ display: "block", touchAction: "none", cursor: isDragging ? "grabbing" : "grab" }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <defs>
          <pattern id="dnaGrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--color-border-soft)" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#dnaGrid)" />

        <g
          transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          {rings.flatMap((ring, ri) =>
            ring.items.map((node, i) => {
              const { x, y } = polarPos(cx, cy, ring.radius, i, ring.items.length, ring.angleOffset || 0);
              const c = COLORS[node.type] ?? COLORS.default;
              const revealed = ri < revealCount;
              return (
                <line
                  key={`edge-${ri}-${node.id}`}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke={hovered === node.id ? c.stroke : "var(--color-border)"}
                  strokeWidth={hovered === node.id ? 1.5 : 1}
                  style={{
                    opacity: revealed ? (hovered === node.id ? 0.9 : 0.6) : 0,
                    transition: "opacity 420ms ease",
                  }}
                />
              );
            })
          )}

          {rings.flatMap((ring, ri) =>
            ring.items.map((node, i) => {
              const { x, y } = polarPos(cx, cy, ring.radius, i, ring.items.length, ring.angleOffset || 0);
              const c = COLORS[node.type] ?? COLORS.default;
              const revealed = ri < revealCount;
              const base = hrefForType[node.type];
              const href = base ? `${base}/${node.id}` : null;
              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => go(href)}
                  style={{
                    cursor: href ? "pointer" : "default",
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? "scale(1)" : "scale(0.4)",
                    transformOrigin: `${x}px ${y}px`,
                    transition: "opacity 420ms ease, transform 420ms cubic-bezier(0.2,0.8,0.2,1)",
                  }}
                >
                  {node.type === "concept" ? (
                    <polygon points={hexPoints(x, y, nodeSize)} fill={c.fill} stroke={c.stroke} strokeWidth={1.2} />
                  ) : node.type === "feature" ? (
                    <rect
                      x={x - nodeSize}
                      y={y - nodeSize}
                      width={nodeSize * 2}
                      height={nodeSize * 2}
                      rx={6}
                      fill={c.fill}
                      stroke={c.stroke}
                      strokeWidth={1.2}
                    />
                  ) : (
                    <circle cx={x} cy={y} r={nodeSize} fill={c.fill} stroke={c.stroke} strokeWidth={1.2} />
                  )}
                  <text
                    x={x}
                    y={y + nodeSize + 15}
                    textAnchor="middle"
                    fill={hovered === node.id ? "var(--color-ink)" : "var(--color-muted)"}
                    fontSize={fontSize}
                  >
                    {truncate(node.label, isMobile ? 12 : 16)}
                  </text>
                </g>
              );
            })
          )}

          <g
            style={{ cursor: center.href ? "pointer" : "default" }}
            onClick={() => center.href && go(center.href)}
          >
            <circle cx={cx} cy={cy} r={30} fill="var(--color-accent)" opacity={0.15} />
            <circle cx={cx} cy={cy} r={20} fill="var(--color-accent)" />
            <text
              x={cx}
              y={cy + 42}
              textAnchor="middle"
              fill="var(--color-ink)"
              fontSize={isMobile ? 12 : 13}
              fontWeight={600}
            >
              {truncate(center.label, isMobile ? 16 : 22)}
            </text>
          </g>
        </g>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-3 border-t border-border-soft">
        <LegendItem colorVar="var(--color-accent)" label="Technology" />
        <LegendItem colorVar="var(--color-cyan)" label="Concept" />
        <LegendItem colorVar="var(--color-muted-dim)" label="Feature" />
        {isMobile && (
          <span className="text-[11px] ml-auto text-muted-dim">Drag to pan · use +/− to zoom</span>
        )}
      </div>
    </div>
  );
}

function GraphCtrlBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-7 h-7 rounded-md flex items-center justify-center hover:opacity-80 transition-opacity bg-elevated border border-border text-ink"
    >
      {children}
    </button>
  );
}

function LegendItem({ colorVar, label }: { colorVar: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-sm" style={{ background: colorVar }} />
      <span className="text-[11px] text-muted">{label}</span>
    </div>
  );
}
