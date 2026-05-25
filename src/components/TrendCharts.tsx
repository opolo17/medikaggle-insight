"use client";

import type { FilterState } from "@/components/FilterBar";
import type { KaggleCompetition } from "@/data/mockKaggleData";
import { computeSotaModelStats } from "@/data/mockKaggleData";
import { buildStrategyInsights } from "@/lib/strategyRecommendations";
import { Lightbulb, Trophy } from "lucide-react";
import { useMemo } from "react";

interface TrendChartsProps {
  competitions: KaggleCompetition[];
  filters: FilterState;
}

const BAR_COLORS = [
  "bg-sky-400",
  "bg-emerald-500",
  "bg-sky-300",
  "bg-emerald-400",
  "bg-cyan-400",
];

function StrategyBanner({ message }: { message: string }) {
  const parts = message.split(/\*\*([^*]+)\*\*/g);

  return (
    <li className="flex gap-3 rounded-lg border border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-sky-500/5 px-4 py-3.5 text-sm leading-relaxed text-slate-200">
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/15"
        aria-hidden
      >
        <Lightbulb className="h-4 w-4 text-emerald-400" strokeWidth={2} />
      </span>
      <p>
        <span className="font-semibold text-emerald-400">Strategy: </span>
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-semibold text-sky-300">
              {part}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>
    </li>
  );
}

export default function TrendCharts({
  competitions,
  filters,
}: TrendChartsProps) {
  const insights = useMemo(
    () => buildStrategyInsights(filters),
    [filters],
  );

  const stats = useMemo(
    () => computeSotaModelStats(competitions),
    [competitions],
  );

  const maxCount = stats[0]?.count ?? 1;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 md:p-6">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" aria-hidden />
            <h2 className="text-lg font-semibold text-slate-100">
              Winning Strategy Recommendations
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Tailored insights from historical medical competition winners
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-400">
          <Lightbulb className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
          <span>
            <strong className="text-slate-200">{insights.length}</strong>{" "}
            {insights.length === 1 ? "insight" : "insights"}
          </span>
        </div>
      </header>

      <ul className="mb-6 space-y-3" role="list">
        {insights.map((message) => (
          <StrategyBanner key={message} message={message} />
        ))}
      </ul>

      <div className="border-t border-slate-800 pt-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Recommended backbone frequency
        </h3>

        {stats.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-700 py-10 text-center text-sm text-slate-500">
            No backbone data for the current selection. Broaden your conditions
            to see SOTA model distribution.
          </div>
        ) : (
          <ul className="space-y-4" role="list">
            {stats.map((stat, index) => {
              const widthPct = Math.max(
                (stat.count / maxCount) * 100,
                stat.count > 0 ? 8 : 0,
              );
              const barColor = BAR_COLORS[index % BAR_COLORS.length];

              return (
                <li key={stat.model} className="group">
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-200">
                      {stat.model}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-slate-400">
                      {stat.count} · {stat.percentage}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800/80">
                    <div
                      className={`h-full rounded-full ${barColor} shadow-[0_0_10px_rgba(56,189,248,0.25)] transition-all duration-500 ease-in-out`}
                      style={{ width: `${widthPct}%` }}
                      role="progressbar"
                      aria-valuenow={stat.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${stat.model}: ${stat.percentage}%`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
