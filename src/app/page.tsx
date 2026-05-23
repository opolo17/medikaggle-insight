"use client";

import CodeSnippetCard from "@/components/CodeSnippetCard";
import FilterBar, { type FilterState } from "@/components/FilterBar";
import TrendCharts from "@/components/TrendCharts";
import {
  filterCompetitions,
  mockKaggleData,
} from "@/data/mockKaggleData";
import { Activity, SearchX } from "lucide-react";
import { useMemo, useState } from "react";

const initialFilters: FilterState = {
  domain: "All",
  task: "All",
  challenge: "All",
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filteredCompetitions = useMemo(
    () =>
      filterCompetitions(
        mockKaggleData,
        filters.domain,
        filters.task,
        filters.challenge,
      ),
    [filters.domain, filters.task, filters.challenge],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
          <Activity className="h-4 w-4 text-emerald-500" aria-hidden />
          <span>Clinical AI pipelines · Live prototype</span>
        </div>
        <h1 className="text-gradient-brand text-3xl font-bold tracking-tight md:text-5xl">
          MediKaggle Insight
        </h1>
        <p className="text-gradient-brand-subtle mt-2 text-lg font-medium md:text-xl">
          Clinical AI Experiment Navigator
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
          Filter medical Kaggle-style competitions by modality, task, and
          clinical constraint. Explore SOTA backbone trends and copy
          production-ready PyTorch templates for your next experiment.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <FilterBar filters={filters} onChange={setFilters} />

        <TrendCharts competitions={filteredCompetitions} />

        <section>
          <header className="mb-4">
            <h2 className="text-lg font-semibold text-slate-100">
              Pipeline Templates
            </h2>
            <p className="text-sm text-slate-400">
              {filteredCompetitions.length} matching{" "}
              {filteredCompetitions.length === 1 ? "dataset" : "datasets"} —
              copy code, launch Colab, or read the paper.
            </p>
          </header>

          {filteredCompetitions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
              <SearchX
                className="h-10 w-10 text-slate-600"
                aria-hidden
              />
              <p className="max-w-md text-sm text-slate-400">
                No matching pipeline templates found for this specific clinical
                constraint.
              </p>
              <button
                type="button"
                onClick={() => setFilters(initialFilters)}
                className="mt-1 rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-400"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredCompetitions.map((competition) => (
                <CodeSnippetCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
