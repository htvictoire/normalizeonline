"use client";

import { useTranslations } from "next-intl";
import type {
  ProfilingOutput, ColumnProfileStats, ColumnProfile, NormalizationIssue, IssueSeverity,
} from "@/lib/types/normalize";
import { TYPE_COLOR } from "@/lib/constants/column-type-colors";
import CountBadge from "@/app/components/count-badge";
import { fillColor, countColor, countBadgeColor, colLetter, fmt, pct } from "@/lib/utils";

const SEVERITY_STYLE: Record<IssueSeverity, string> = {
  ERROR:   "border-red-200 bg-red-50 text-red-800",
  WARNING: "border-amber-200 bg-amber-50 text-amber-800",
  INFO:    "border-blue-200 bg-blue-50 text-blue-800",
};

function formatLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type Tx = (key: string, values?: Record<string, string | number>) => string;
type ProfileResult = { text: string; warn?: string };
type ProfileHandler<T extends ColumnProfile> = (p: T, t: Tx) => ProfileResult;

const PROFILE_STATS: { [K in ColumnProfile["profile_type"]]: ProfileHandler<Extract<ColumnProfile, { profile_type: K }>> } = {
  string: (p, t) => ({
    text: [
      t("profiling.distinct", { count: fmt(p.distinct_count) }),
      t("profiling.unique", { ratio: pct(p.distinct_ratio) }),
      p.min_length === p.max_length
        ? t("profiling.lengthFixed", { n: p.min_length })
        : t("profiling.lengthRange", { min: p.min_length, max: p.max_length }),
    ].join(" · "),
  }),

  boolean: (p, t) => {
    const total = p.true_token_count + p.false_token_count + p.unrecognized_count;
    const parts = [
      t("profiling.trueTokens",  { count: fmt(p.true_token_count),  ratio: pct(total > 0 ? p.true_token_count  / total : 0) }),
      t("profiling.falseTokens", { count: fmt(p.false_token_count), ratio: pct(total > 0 ? p.false_token_count / total : 0) }),
    ];
    if (p.unrecognized_count > 0) parts.push(t("profiling.unrecognized", { count: fmt(p.unrecognized_count) }));
    return { text: parts.join(" · ") };
  },

  integer: (p, t) => ({
    text: p.parse_match_ratio >= 1
      ? t("profiling.allParsed")
      : t("profiling.parsedStats", { ratio: pct(p.parse_match_ratio), count: fmt(p.parse_match_count) }),
  }),

  date: (p, t) => ({
    text: p.format_match_ratio >= 1
      ? t("profiling.allMatched")
      : t("profiling.formatMatchStats", { ratio: pct(p.format_match_ratio), count: fmt(p.format_match_count) }),
  }),

  decimal: (p, t) => ({
    text: p.parse_match_ratio >= 1
      ? t("profiling.allParsed")
      : t("profiling.parsedStats", { ratio: pct(p.parse_match_ratio), count: fmt(p.parse_match_count) }),
    warn: p.separator_mismatch_detected
      ? p.swapped_match_count > 0
        ? t("profiling.separatorMismatchSwapped", { count: fmt(p.swapped_match_count) })
        : t("profiling.separatorMismatch")
      : undefined,
  }),

  percentage: (p, t) => ({
    text: p.parse_match_ratio >= 1
      ? t("profiling.allParsed")
      : t("profiling.parsedStats", { ratio: pct(p.parse_match_ratio), count: fmt(p.parse_match_count) }),
    warn: p.separator_mismatch_detected
      ? p.swapped_match_count > 0
        ? t("profiling.separatorMismatchSwapped", { count: fmt(p.swapped_match_count) })
        : t("profiling.separatorMismatch")
      : undefined,
  }),

  signed: (p, t) => ({
    text: p.parse_match_ratio >= 1
      ? t("profiling.allParsed")
      : t("profiling.parsedStats", { ratio: pct(p.parse_match_ratio), count: fmt(p.parse_match_count) }),
    warn: p.separator_mismatch_detected
      ? p.swapped_match_count > 0
        ? t("profiling.separatorMismatchSwapped", { count: fmt(p.swapped_match_count) })
        : t("profiling.separatorMismatch")
      : undefined,
  }),

  currency: (p, t) => {
    const parts = [
      p.parse_match_ratio >= 1
        ? t("profiling.allParsed")
        : t("profiling.parsedStats", { ratio: pct(p.parse_match_ratio), count: fmt(p.parse_match_count) }),
      t("profiling.withSymbol", { count: fmt(p.symbol_detected_count) }),
    ];
    const symbols = Object.entries(p.symbol_distribution)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k || t("profiling.noValue")} ${fmt(v)}`)
      .join(", ");
    if (symbols) parts.push(symbols);
    if (p.separator_mismatch_detected) parts.push(t("profiling.separatorMismatch"));
    return { text: parts.join(" · ") };
  },

  accounting: (p, t) => {
    const parts = [
      p.parse_match_ratio >= 1
        ? t("profiling.allParsed")
        : t("profiling.parsedStats", { ratio: pct(p.parse_match_ratio), count: fmt(p.parse_match_count) }),
    ];
    const notations = Object.entries(p.sign_notation_distribution)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k || t("profiling.noValue")} ${fmt(v)}`)
      .join(", ");
    if (notations) parts.push(notations);
    if (p.separator_mismatch_detected) parts.push(t("profiling.separatorMismatch"));
    return { text: parts.join(" · ") };
  },
};

function profileStats(profile: ColumnProfile, t: Tx): ProfileResult {
  return (PROFILE_STATS[profile.profile_type] as ProfileHandler<typeof profile>)(profile, t);
}

function ColumnCard({ index, stats, rowCount, issues, t }: {
  index: number;
  stats: ColumnProfileStats;
  rowCount: number;
  issues: NormalizationIssue[];
  t: Tx;
}) {
  const colors = TYPE_COLOR[stats.column_type];
  const fp = rowCount > 0 ? (stats.counts.non_null_count / rowCount) * 100 : 0;
  const fpLabel = fp === 100 ? "100%" : `${fp.toFixed(1)}%`;
  const nullCount = stats.counts.null_count;
  const extraNullish = stats.counts.nullish_count - stats.counts.null_count;
  const { text, warn } = profileStats(stats.type_profile, t);

  return (
    <div className="flex items-start gap-4 py-5">
      <div className="shrink-0 pt-0.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${colors.circle}`}>
          {colLetter(index)}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="truncate font-medium text-ink">{formatLabel(stats.label)}</span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}>
              {stats.column_type}
            </span>
            {issues.length > 0 && (
              <span className="shrink-0 inline-flex items-center gap-1 text-xs text-amber-600">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
                {issues.length === 1 ? issues[0].code : `${issues.length}`}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 tabular-nums">
            {nullCount > 0 && (
              <CountBadge
                value={fmt(nullCount)}
                label={t("profiling.nulls")}
                badgeClassName={countBadgeColor(nullCount, rowCount)}
                valueClassName={countColor(nullCount, rowCount)}
              />
            )}
            {extraNullish > 0 && (
              <CountBadge
                value={fmt(extraNullish)}
                label={t("profiling.nullish")}
                badgeClassName={countBadgeColor(extraNullish, rowCount)}
                valueClassName={countColor(extraNullish, rowCount)}
              />
            )}
            <span className={`text-sm ${fillColor(fp)}`}>{fpLabel}</span>
          </div>
        </div>
        {text && <p className="mt-1.5 text-xs text-ink-muted">{text}</p>}
        {warn && <p className="mt-0.5 text-xs text-amber-600">{warn}</p>}
      </div>
    </div>
  );
}

export default function ProfilingDashboard({ output }: { output: ProfilingOutput }) {
  const t = useTranslations("processing");
  const columnEntries = Object.entries(output.column_stats);
  const globalIssues  = output.issues.filter((i) => !i.location);

  return (
    <div className="flex flex-col gap-5">
      {globalIssues.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {globalIssues.map((iss) => (
            <p key={`${iss.code}-${iss.message}`} className={`rounded-xl border px-4 py-3 text-sm ${SEVERITY_STYLE[iss.severity]}`}>
              <span className="font-mono font-semibold">{iss.code}</span>
              <span className="mx-2 opacity-40">·</span>
              {iss.message}
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl border border-border">
        {columnEntries.map(([key, stats], i) => {
          const colIssues = output.issues.filter((iss) => iss.location === key);
          const isRight = i % 2 === 1;
          return (
            <div
              key={key}
              className={`px-6 ${isRight ? "sm:border-l border-border" : ""} ${i >= 2 ? "border-t border-border" : ""}`}
            >
              <ColumnCard index={i} stats={stats} rowCount={output.row_count} issues={colIssues} t={t} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
