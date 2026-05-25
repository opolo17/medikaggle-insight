"use client";

import CodeSnippetCard from "@/components/CodeSnippetCard";
import FilterBar, { type FilterState } from "@/components/FilterBar";
import TrendCharts from "@/components/TrendCharts";
import { mockKaggleData } from "@/data/mockKaggleData";
import {
  hasActiveConstraints,
  rankCompetitions,
} from "@/lib/matchRate";
import { SearchX, Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

const initialFilters: FilterState = {
  domain: "All",
  task: "All",
  challenge: "All",
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const rankedCompetitions = useMemo(
    () => rankCompetitions(mockKaggleData, filters),
    [filters],
  );

  const analyzing = hasActiveConstraints(filters);

  const chartCompetitions = useMemo(() => {
    if (!analyzing) {
      return rankedCompetitions.map((r) => r.competition);
    }
    return rankedCompetitions
      .filter((r) => (r.matchRate ?? 0) > 0)
      .map((r) => r.competition);
  }, [rankedCompetitions, analyzing]);

  const visibleCards = useMemo(() => {
    if (!analyzing) return rankedCompetitions;
    return rankedCompetitions.filter((r) => (r.matchRate ?? 0) > 0);
  }, [rankedCompetitions, analyzing]);

  const handleAnalyze = useCallback(() => {
    document
      .getElementById("analysis-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="h-4 w-4 text-emerald-500" aria-hidden />
          <span>New competition analysis workflow</span>
        </div>
        <h1 className="text-gradient-brand text-3xl font-bold tracking-tight md:text-5xl">
          MediKaggle Insight
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
          Enter the constraints of the new medical AI challenge to get SOTA
          baseline recommendations.
        </p>
      </header>

      <div className="relative flex flex-col gap-6">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onAnalyze={handleAnalyze}
        />

        <div id="analysis-results" className="scroll-mt-6 flex flex-col gap-6">
          <TrendCharts
            competitions={chartCompetitions}
            filters={filters}
          />

          <section>
            <header className="mb-4">
              <h2 className="text-lg font-semibold text-slate-100">
                Pipeline Templates
              </h2>
              <p className="text-sm text-slate-400">
                {analyzing
                  ? `${visibleCards.length} ranked by match rate — highest relevance first.`
                  : `${visibleCards.length} datasets — sorted by most recently listed.`}
              </p>
            </header>

            {visibleCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
                <SearchX className="h-10 w-10 text-slate-600" aria-hidden />
                <p className="max-w-md text-sm text-slate-400">
                  No pipeline templates match your selected conditions. Try
                  broadening data type, task, or challenge tags.
                </p>
                <button
                  type="button"
                  onClick={() => setFilters(initialFilters)}
                  className="mt-1 rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-400"
                >
                  Reset all conditions
                </button>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {visibleCards.map(({ competition, matchRate }) => (
                  <CodeSnippetCard
                    key={competition.id}
                    competition={competition}
                    matchRate={matchRate}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
