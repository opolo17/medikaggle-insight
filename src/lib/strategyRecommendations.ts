import type {
  Challenge,
  Domain,
  KaggleCompetition,
  Task,
} from "@/data/mockKaggleData";
import { mockKaggleData } from "@/data/mockKaggleData";
import type { CompetitionFilters } from "@/lib/matchRate";
import { hasActiveConstraints } from "@/lib/matchRate";

function subsetByDomain(data: KaggleCompetition[], domain: Domain) {
  return data.filter((c) => c.domain === domain);
}

function subsetByTask(data: KaggleCompetition[], task: Task) {
  return data.filter((c) => c.task === task);
}

function subsetByChallenge(data: KaggleCompetition[], challenge: Challenge) {
  return data.filter((c) => c.challenge === challenge);
}

function topSotaModel(data: KaggleCompetition[]): string | null {
  if (data.length === 0) return null;
  const counts = new Map<string, number>();
  for (const c of data) {
    counts.set(c.sotaModel, (counts.get(c.sotaModel) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function lossUsagePercent(
  data: KaggleCompetition[],
  lossNames: string[],
): number {
  if (data.length === 0) return 0;
  const hits = data.filter((c) => lossNames.includes(c.lossName)).length;
  return Math.round((hits / data.length) * 100);
}

function domainInsight(domain: Domain, data: KaggleCompetition[]): string | null {
  const pool = subsetByDomain(data, domain);
  const top = topSotaModel(pool);
  if (!top) return null;

  const messages: Record<Domain, string> = {
    "3D Image": `For 3D volumetric data, **${top}** is the most highly recommended backbone.`,
    "2D Image": `For 2D medical imaging, **${top}** dominates winning detection and classification pipelines.`,
    EHR: `For clinical text (EHR), **${top}** is the top-performing encoder in comparable Kaggle-style tasks.`,
    Biosignal: `For biosignal time-series (ECG, etc.), **${top}** is the strongest baseline architecture.`,
  };
  return messages[domain];
}

function taskInsight(task: Task, data: KaggleCompetition[]): string | null {
  const pool = subsetByTask(data, task);
  if (pool.length === 0) return null;

  const topLoss = pool.reduce<Map<string, number>>((acc, c) => {
    acc.set(c.lossName, (acc.get(c.lossName) ?? 0) + 1);
    return acc;
  }, new Map());
  const leadingLoss = [...topLoss.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!leadingLoss) return null;

  if (task === "Segmentation") {
    return `Segmentation winners most often pair volumetric encoders with **${leadingLoss}** for overlap-based optimization.`;
  }
  if (task === "Classification") {
    return `Classification leaderboards favor **${leadingLoss}** when label distributions are skewed or multi-label.`;
  }
  return `Object detection top solutions rely on **${leadingLoss}** for tighter box regression under annotation noise.`;
}

function challengeInsight(
  challenge: Challenge,
  data: KaggleCompetition[],
): string | null {
  const pool = subsetByChallenge(data, challenge);
  if (pool.length === 0) return null;

  if (challenge === "Class Imbalance") {
    const pct = lossUsagePercent(pool, ["Focal Loss", "Weighted BCE Loss"]);
    return `${pct}% of past winners dealing with Class Imbalance utilized **Focal Loss** or **Weighted BCE**.`;
  }

  if (challenge === "Small Dataset") {
    const top = topSotaModel(pool);
    return `Small-dataset winners (${pool.length} references) stress heavy augmentation and compact models — **${top ?? "MONAI 3D pipelines"}** with regularization is the safest default.`;
  }

  if (challenge === "Noisy Label") {
    const pct = lossUsagePercent(pool, ["CIoU Loss", "Cross Entropy"]);
    return `${pct}% of noisy-label competitions adopted **geometry-aware losses (CIoU)** or **label-smoothed cross-entropy** to stabilize training.`;
  }

  return null;
}

/** Build 💡 strategy lines from active user-selected conditions */
export function buildStrategyInsights(
  filters: CompetitionFilters,
  referenceData: KaggleCompetition[] = mockKaggleData,
): string[] {
  if (!hasActiveConstraints(filters)) {
    return [
      "Select data type, task, or challenge tags above to generate a tailored winning-strategy report from historical medical Kaggle pipelines.",
    ];
  }

  const insights: string[] = [];

  if (filters.domain !== "All") {
    const line = domainInsight(filters.domain, referenceData);
    if (line) insights.push(line);
  }

  if (filters.task !== "All") {
    const line = taskInsight(filters.task, referenceData);
    if (line) insights.push(line);
  }

  if (filters.challenge !== "All") {
    const line = challengeInsight(filters.challenge, referenceData);
    if (line) insights.push(line);
  }

  return insights;
}
