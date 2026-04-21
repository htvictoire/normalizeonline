"use client";

import type { NormalizationOutput } from "@/lib/types/normalize";
import { pct } from "@/lib/utils";

function fmtShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

type RGB = [number, number, number];

const GREEN: RGB = [34,  197, 94];
const AMBER: RGB = [245, 158, 11];
const RED:   RGB = [239, 68,  68];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function blendColor(c1: RGB, c2: RGB, t: number): string {
  return `rgb(${Math.round(lerp(c1[0], c2[0], t))},${Math.round(lerp(c1[1], c2[1], t))},${Math.round(lerp(c1[2], c2[2], t))})`;
}

function gradientColor(t: number, direction: "green-red" | "red-green"): string {
  const [start, end] = direction === "green-red" ? [GREEN, RED] : [RED, GREEN];
  if (t <= 0.5) return blendColor(start, AMBER, t * 2);
  return blendColor(AMBER, end, (t - 0.5) * 2);
}

const ARC_RADIUS      = 36;
const ARC_STROKE      = 14;
const ARC_BOX         = 88;
const ARC_FONT_SIZE   = 15;
const ARC_SEGMENTS    = 40;
const ARC_FRACTION    = 0.75;
const ARC_GAP_OVERLAP = 0.8;

function ArcGauge({ ratio, value, label, color, gradient }: {
  ratio: number;
  value: string;
  label: string;
  color: string;
  gradient?: "green-red" | "red-green";
}) {
  const cx = ARC_BOX / 2;
  const cy = ARC_BOX / 2;
  const circumference = 2 * Math.PI * ARC_RADIUS;
  const arcLen  = circumference * ARC_FRACTION;
  const gapLen  = circumference - arcLen;
  const segDeg  = 270 / ARC_SEGMENTS;
  const segLen  = circumference * (segDeg / 360) + ARC_GAP_OVERLAP;
  const clamped = Math.min(Math.max(ratio, 0), 1);
  const filled  = Math.round(ARC_SEGMENTS * clamped);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: ARC_BOX, height: ARC_BOX }}>
        <svg width={ARC_BOX} height={ARC_BOX} viewBox={`0 0 ${ARC_BOX} ${ARC_BOX}`}>
          <circle
            cx={cx} cy={cy} r={ARC_RADIUS}
            fill="none" stroke="#e4e4e7" strokeWidth={ARC_STROKE}
            strokeDasharray={`${arcLen} ${gapLen}`}
            strokeLinecap="round"
            transform={`rotate(135 ${cx} ${cy})`}
          />
          {gradient
            ? Array.from({ length: filled }).map((_, i) => (
                <circle
                  key={i}
                  cx={cx} cy={cy} r={ARC_RADIUS}
                  fill="none"
                  stroke={gradientColor(i / (ARC_SEGMENTS - 1), gradient)}
                  strokeWidth={ARC_STROKE}
                  strokeDasharray={`${segLen} ${circumference - segLen}`}
                  strokeLinecap={i === 0 || i === filled - 1 ? "round" : "butt"}
                  transform={`rotate(${135 + i * segDeg} ${cx} ${cy})`}
                />
              ))
            : clamped > 0.005 && (
                <circle
                  cx={cx} cy={cy} r={ARC_RADIUS}
                  fill="none" stroke={color} strokeWidth={ARC_STROKE}
                  strokeDasharray={`${arcLen * clamped} ${circumference - arcLen * clamped}`}
                  strokeLinecap="round"
                  transform={`rotate(135 ${cx} ${cy})`}
                />
              )
          }
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold tabular-nums text-ink" style={{ fontSize: ARC_FONT_SIZE }}>
            {value}
          </span>
        </div>
      </div>
      <p className="text-center text-xs leading-tight text-ink-muted">{label}</p>
    </div>
  );
}

export default function QualityPanel({ output }: { output: NormalizationOutput }) {
  const q = output.quality_output;
  const score = parseFloat(q.quality_score);
  const errorRatio   = q.total_cells > 0 ? q.total_parse_error_cells / q.total_cells : 0;
  const nullishRatio = q.total_cells > 0 ? q.total_nullish_cells      / q.total_cells : 0;

  return (
    <div className="flex flex-wrap items-center justify-around gap-x-6 gap-y-8 py-2">
      <ArcGauge ratio={1}                     value={fmtShort(q.total_cells)}             label="Total cells"   color="#2596be"      />
      <ArcGauge ratio={score / 100}           value={score.toFixed(1)}                    label="Quality score" gradient="red-green" color="" />
      <ArcGauge ratio={q.parse_success_ratio} value={pct(q.parse_success_ratio)}          label="Parse success" gradient="red-green" color="" />
      <ArcGauge ratio={q.completeness_ratio}  value={pct(q.completeness_ratio)}           label="Completeness"  gradient="red-green" color="" />
      <ArcGauge ratio={errorRatio}            value={fmtShort(q.total_parse_error_cells)} label="Parse errors"  gradient="green-red" color="" />
      <ArcGauge ratio={nullishRatio}          value={fmtShort(q.total_nullish_cells)}     label="Nullish cells" gradient="green-red" color="" />
    </div>
  );
}
