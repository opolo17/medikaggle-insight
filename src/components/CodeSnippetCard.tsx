"use client";

import {
  getFullPipelineCode,
  type KaggleCompetition,
  type PipelineCodeSnippets,
} from "@/data/mockKaggleData";
import LossFormula from "@/components/LossFormula";
import {
  BookOpen,
  Box,
  Check,
  Copy,
  ExternalLink,
  FlaskConical,
  Gauge,
  Layers,
  Scale,
} from "lucide-react";
import { getMatchBadgeStyle } from "@/lib/matchRate";
import { useCallback, useState } from "react";

interface CodeSnippetCardProps {
  competition: KaggleCompetition;
  matchRate: number | null;
}

type SnippetTab = keyof PipelineCodeSnippets;

const TABS: {
  key: SnippetTab;
  label: string;
  icon: typeof Box;
}[] = [
  { key: "model", label: "Model", icon: Box },
  { key: "loss", label: "Loss", icon: Scale },
  { key: "augmentation", label: "Augmentation", icon: Layers },
];

function MatchRateBadge({ matchRate }: { matchRate: number }) {
  const { emoji, className } = getMatchBadgeStyle(matchRate);
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      <span aria-hidden>{emoji}</span>
      {matchRate}% Match
    </span>
  );
}

function Tag({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

const DOMAIN_COLORS: Record<KaggleCompetition["domain"], string> = {
  "3D Image": "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "2D Image": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  EHR: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Biosignal: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const TASK_COLORS: Record<KaggleCompetition["task"], string> = {
  Segmentation: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Classification: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "Object Detection": "bg-orange-500/15 text-orange-300 border-orange-500/30",
};

const CHALLENGE_COLORS: Record<KaggleCompetition["challenge"], string> = {
  "Class Imbalance": "bg-pink-500/15 text-pink-300 border-pink-500/30",
  "Small Dataset": "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  "Noisy Label": "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
};

export default function CodeSnippetCard({
  competition,
  matchRate,
}: CodeSnippetCardProps) {
  const [activeTab, setActiveTab] = useState<SnippetTab>("model");
  const [copied, setCopied] = useState(false);
  const fullCode = getFullPipelineCode(competition.codeSnippets);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [fullCode]);

  const handleTabChange = (tab: SnippetTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-card transition hover:border-slate-700 hover:bg-slate-800/80">
      <header className="border-b border-slate-800 p-4 md:p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
          <FlaskConical className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
          <span className="font-mono">{competition.competitionName}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-50">
            {competition.title}
          </h3>
          {matchRate !== null && <MatchRateBadge matchRate={matchRate} />}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Tag label={competition.domain} className={DOMAIN_COLORS[competition.domain]} />
          <Tag label={competition.task} className={TASK_COLORS[competition.task]} />
          <Tag
            label={competition.challenge}
            className={CHALLENGE_COLORS[competition.challenge]}
          />
        </div>
      </header>

      <div className="space-y-4 border-b border-slate-800 p-4 md:p-5">
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500">
              <Gauge className="h-3 w-3" aria-hidden />
              Metrics
            </dt>
            <dd className="mt-0.5 font-medium text-violet-300">
              {competition.metricName}
            </dd>
            <dd className="font-mono text-sm text-slate-100">
              {competition.metricValue}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              SOTA Model
            </dt>
            <dd className="mt-0.5 font-medium text-emerald-400">
              {competition.sotaModel}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Loss Function
            </dt>
            <dd className="mt-0.5 font-medium text-sky-400">
              {competition.lossName}
            </dd>
          </div>
        </dl>

        <div className="rounded-lg border border-emerald-500/20 bg-gradient-to-br from-slate-950 to-slate-900 px-4 py-3 ring-1 ring-slate-700/50">
          <p className="mb-2 w-full text-center text-[10px] font-semibold uppercase tracking-widest text-emerald-500/80">
            Loss formulation (LaTeX)
          </p>
          <div className="loss-formula-box scrollbar-pipeline w-full">
            <LossFormula
              formula={competition.lossFormula}
              label={`${competition.lossName} formula`}
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 md:px-5">
          <span className="text-xs font-medium text-slate-500">
            PyTorch pipeline
          </span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            .py
          </span>
        </div>

        <div
          className="flex border-b border-slate-800 bg-slate-950/60"
          role="tablist"
          aria-label="Pipeline code modules"
        >
          {TABS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${competition.id}-${key}`}
                id={`tab-${competition.id}-${key}`}
                onClick={() => handleTabChange(key)}
                className={[
                  "flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-all duration-300",
                  isActive
                    ? "border-emerald-500 bg-slate-900/80 text-emerald-400"
                    : "border-transparent text-slate-500 hover:bg-slate-900/40 hover:text-slate-300",
                ].join(" ")}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {label}
              </button>
            );
          })}
        </div>

        <div
          className="relative min-h-[11rem] bg-slate-950/90"
          role="tabpanel"
          id={`panel-${competition.id}-${activeTab}`}
          aria-labelledby={`tab-${competition.id}-${activeTab}`}
        >
          <pre
            key={activeTab}
            className="code-panel scrollbar-pipeline h-full min-h-[11rem] p-4 font-mono text-xs leading-relaxed text-slate-300 transition-opacity duration-300 md:px-5"
          >
            <code className="block whitespace-pre">
              {competition.codeSnippets[activeTab]}
            </code>
          </pre>
        </div>
      </div>

      <footer className="flex flex-wrap gap-2 border-t border-slate-800 p-3 md:p-4">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-emerald-500/50 hover:text-emerald-400"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden />
              Copy Full Pipeline
            </>
          )}
        </button>
        <a
          href={competition.colabUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          Open in Colab
        </a>
        <a
          href={competition.paperUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:text-slate-100"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden />
          Read Paper
        </a>
      </footer>
    </article>
  );
}
