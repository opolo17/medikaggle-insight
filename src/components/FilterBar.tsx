"use client";

import type { ReactNode } from "react";
import {
  CHALLENGE_OPTIONS,
  DOMAIN_OPTIONS,
  TASK_OPTIONS,
  type ChallengeFilter,
  type DomainFilter,
  type TaskFilter,
} from "@/data/mockKaggleData";
import { hasActiveConstraints } from "@/lib/matchRate";
import { ClipboardList, Layers, Sparkles, Target } from "lucide-react";

export interface FilterState {
  domain: DomainFilter;
  task: TaskFilter;
  challenge: ChallengeFilter;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onAnalyze?: () => void;
}

export { hasActiveConstraints };

interface FilterGroupProps<T extends string> {
  label: string;
  icon: ReactNode;
  options: readonly T[];
  value: T;
  onSelect: (value: T) => void;
}

function FilterGroup<T extends string>({
  label,
  icon,
  options,
  value,
  onSelect,
}: FilterGroupProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={[
                "relative z-10 cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-300",
                active
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                  : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterBar({
  filters,
  onChange,
  onAnalyze,
}: FilterBarProps) {
  const showAnalyze = hasActiveConstraints(filters);

  return (
    <section className="relative z-30 isolate rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
            <h2 className="text-sm font-semibold text-slate-200">
              Target Competition Conditions
            </h2>
          </div>
          <p className="mt-0.5 pl-6 text-[11px] text-slate-500">
            Enter constraints for your new medical AI challenge
          </p>
        </div>

        {showAnalyze ? (
          <button
            type="button"
            onClick={onAnalyze}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/60 bg-gradient-to-r from-emerald-600/90 to-sky-600/80 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition hover:from-emerald-500 hover:to-sky-500 hover:shadow-[0_0_28px_rgba(16,185,129,0.5)]"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Analyze Match
          </button>
        ) : (
          <span className="rounded-md border border-dashed border-slate-700 bg-slate-950/80 px-3 py-1.5 text-[11px] text-slate-500">
            Select at least one condition to run analysis
          </span>
        )}
      </div>

      <div className="relative z-10 grid gap-5 lg:grid-cols-3">
        <FilterGroup
          label="Data Type"
          icon={<Layers className="h-3.5 w-3.5 text-sky-400" aria-hidden />}
          options={DOMAIN_OPTIONS}
          value={filters.domain}
          onSelect={(domain) => onChange({ ...filters, domain })}
        />
        <FilterGroup
          label="Task"
          icon={<Target className="h-3.5 w-3.5 text-sky-400" aria-hidden />}
          options={TASK_OPTIONS}
          value={filters.task}
          onSelect={(task) => onChange({ ...filters, task })}
        />
        <FilterGroup
          label="Challenge"
          icon={<ClipboardList className="h-3.5 w-3.5 text-sky-400" aria-hidden />}
          options={CHALLENGE_OPTIONS}
          value={filters.challenge}
          onSelect={(challenge) => onChange({ ...filters, challenge })}
        />
      </div>
    </section>
  );
}
