// Shared dashboard tokens: single source of truth for private UI surfaces.
// Guns.lol renewal: glass hairlines instead of solid zinc, pill tabs, white focus rings.
export const card =
  "rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md px-5 py-4";

export const cardTitle = "text-sm font-semibold text-white tracking-tight";

export const cardDesc = "mt-0.5 text-xs text-zinc-500";

export const sectionHead = "mb-3 flex items-center gap-2.5";

export const fieldLabel = "mb-1.5 block text-[13px] font-medium text-zinc-300";

export const input =
  "w-full min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-zinc-500 backdrop-blur-sm focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20";

export const textarea = `${input} resize-none`;

export const select =
  "rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20";

export const row =
  "flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-sm";

export const toggleRow = row;

export const iconBtn =
  "text-zinc-500 transition-colors hover:text-white";

export const dangerIconBtn =
  "text-zinc-500 transition-colors hover:text-red-400";

export const emptyState =
  "py-6 text-center text-sm text-zinc-500";

export const errorBox =
  "rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400";

export const infoBox =
  "rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs text-zinc-400";

export const tabBtn = (active: boolean) =>
  `flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-all ${
    active ? "bg-white text-zinc-950 shadow" : "text-zinc-400 hover:text-white hover:bg-white/5"
  }`;

export const toggle = (on: boolean, onColorClass = "bg-white") =>
  `relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
    on ? onColorClass : "bg-white/10"
  }`;

export const toggleKnob = (on: boolean) =>
  `inline-block h-4 w-4 transform rounded-full transition-transform ${
    on ? "translate-x-6 bg-zinc-950" : "translate-x-1 bg-white"
  }`;
