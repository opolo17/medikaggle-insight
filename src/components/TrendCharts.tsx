"use client";

import type { KaggleCompetition } from "@/data/mockKaggleData";
import { computeSotaModelStats } from "@/data/mockKaggleData";
import { BarChart3, TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface TrendChartsProps {
  competitions: KaggleCompetition[];
}

const BAR_COLORS = [
  "bg-sky-400",
  "bg-emerald-500",
  "bg-sky-300",
  "bg-emerald-400",
  "bg-cyan-400",
];

export default function TrendCharts({ competitions }: TrendChartsProps) {
  const stats = useMemo(
    () => computeSotaModelStats(competitions),
    [competitions],
  );

  const maxCount = stats[0]?.count ?? 1;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 md:p-6">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-sky-400" aria-hidden />
            <h2 className="text-lg font-semibold text-slate-100">
              SOTA Model Usage Trends
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Frequency of state-of-the-art backbones across filtered pipelines
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-400">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
          <span>
            <strong className="text-slate-200">{competitions.length}</strong>{" "}
            active {competitions.length === 1 ? "competition" : "competitions"}
          </span>
        </div>
      </header>

      {stats.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 py-12 text-center text-sm text-slate-500">
          No SOTA model data for the current filter selection.
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
                  <span className="font-medium text-slate-200">{stat.model}</span>
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
    </section>
  );
}
