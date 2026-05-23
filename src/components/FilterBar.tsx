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
import { Filter, Layers, Target } from "lucide-react";

export interface FilterState {
  domain: DomainFilter;
  task: TaskFilter;
  challenge: ChallengeFilter;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

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
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-300",
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

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg md:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-emerald-500" aria-hidden />
          <h2 className="text-sm font-semibold text-slate-200">
            Clinical Constraint Filters
          </h2>
        </div>
        <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] text-emerald-500/80">
          TERMINAL / ACTIVE
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
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
          icon={<Filter className="h-3.5 w-3.5 text-sky-400" aria-hidden />}
          options={CHALLENGE_OPTIONS}
          value={filters.challenge}
          onSelect={(challenge) => onChange({ ...filters, challenge })}
        />
      </div>
    </section>
  );
}
