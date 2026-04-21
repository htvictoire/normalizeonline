import type { InstanceStatus, StageKey, StageColor } from "@/lib/types/normalize";

export type { StageKey, StageColor };

type StatusMeta = {
  stage: StageKey;
  inFlight: boolean;
  terminal: boolean;
  translationKey: string;
  checkpoint: { floor: number; ceil: number };
  bannerStyle: string;
};

export const STAGE_COLORS: Record<StageKey, StageColor> = {
  confirmed:   { done: "bg-brand",      activeBorder: "border-brand",      activeBg: "bg-brand/10",      activePulse: "bg-brand"      },
  profiling:   { done: "bg-violet-500", activeBorder: "border-violet-500", activeBg: "bg-violet-500/10", activePulse: "bg-violet-500" },
  normalizing: { done: "bg-blue-500",   activeBorder: "border-blue-500",   activeBg: "bg-blue-500/10",   activePulse: "bg-blue-500"   },
  complete:    { done: "bg-green-500",  activeBorder: "border-green-500",  activeBg: "bg-green-500/10",  activePulse: "bg-green-500"  },
};

export const STAGE_ORDER: StageKey[] = ["confirmed", "profiling", "normalizing", "complete"];

export const STATUS_CONFIG: Record<InstanceStatus, StatusMeta> = {
  PENDING:               { stage: "confirmed",   inFlight: false, terminal: false, translationKey: "statusPending",           checkpoint: { floor: 0,   ceil: 0   }, bannerStyle: "bg-zinc-50 border-border text-ink-muted"       },
  AWAITING_CONFIRMATION: { stage: "confirmed",   inFlight: false, terminal: false, translationKey: "statusAwaiting",          checkpoint: { floor: 0,   ceil: 5   }, bannerStyle: "bg-zinc-50 border-border text-ink-muted"       },
  CONFIRMED:             { stage: "confirmed",   inFlight: true,  terminal: false, translationKey: "statusConfirmed",         checkpoint: { floor: 5,   ceil: 18  }, bannerStyle: "bg-blue-50 border-blue-200 text-blue-800"      },
  PROFILING:             { stage: "profiling",   inFlight: true,  terminal: false, translationKey: "statusProfiling",         checkpoint: { floor: 25,  ceil: 48  }, bannerStyle: "bg-blue-50 border-blue-200 text-blue-800"      },
  PROFILED:              { stage: "profiling",   inFlight: true,  terminal: false, translationKey: "statusProfiled",          checkpoint: { floor: 52,  ceil: 58  }, bannerStyle: "bg-blue-50 border-blue-200 text-blue-800"      },
  NORMALIZING:           { stage: "normalizing", inFlight: true,  terminal: false, translationKey: "statusNormalizing",       checkpoint: { floor: 62,  ceil: 88  }, bannerStyle: "bg-blue-50 border-blue-200 text-blue-800"      },
  READY:                 { stage: "complete",    inFlight: false, terminal: true,  translationKey: "statusReady",             checkpoint: { floor: 100, ceil: 100 }, bannerStyle: "bg-green-50 border-green-200 text-green-800"   },
  READY_WITH_WARNINGS:   { stage: "complete",    inFlight: false, terminal: true,  translationKey: "statusReadyWithWarnings", checkpoint: { floor: 100, ceil: 100 }, bannerStyle: "bg-amber-50 border-amber-200 text-amber-800"   },
  BLOCKED:               { stage: "complete",    inFlight: false, terminal: true,  translationKey: "statusBlocked",           checkpoint: { floor: 100, ceil: 100 }, bannerStyle: "bg-amber-50 border-amber-200 text-amber-800"   },
  FAILED:                { stage: "complete",    inFlight: false, terminal: true,  translationKey: "statusFailed",            checkpoint: { floor: 100, ceil: 100 }, bannerStyle: "bg-red-50 border-red-200 text-red-800"         },
};

const allStatuses = Object.keys(STATUS_CONFIG) as InstanceStatus[];

export const IN_FLIGHT       = allStatuses.filter((s) => STATUS_CONFIG[s].inFlight);
export const TERMINAL        = allStatuses.filter((s) => STATUS_CONFIG[s].terminal);
export const POST_CONFIRMATION = allStatuses.filter((s) => STATUS_CONFIG[s].inFlight || STATUS_CONFIG[s].terminal);

export const STAGES = STAGE_ORDER.map((key) => ({
  key,
  statuses: allStatuses.filter((s) => STATUS_CONFIG[s].stage === key),
  color: STAGE_COLORS[key],
}));
