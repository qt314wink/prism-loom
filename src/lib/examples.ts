import type { TraceRole } from "@/lib/scores";

export const TRACE_COLORS = ["#8eb4d3", "#c4a882", "#88b39a", "#d0907c", "#b7a8c9", "#9bb8b0"] as const;

export const ROLE_COLORS: Record<TraceRole, string> = {
  result: "#8eb4d3",
  envelope: "#c4a882",
  carrier: "#88b39a",
  companion: "#d0907c",
};

export const MAX_TRACES = 6;

export const DEFAULT_VIEW = {
  xMin: 0,
  xMax: 6 * Math.PI,
  yMin: -1.7,
  yMax: 1.7,
};

export function colorForRole(role: TraceRole | undefined, index: number) {
  if (role && ROLE_COLORS[role]) return ROLE_COLORS[role];
  return TRACE_COLORS[index % TRACE_COLORS.length]!;
}
