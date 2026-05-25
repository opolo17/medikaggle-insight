import type {
  ChallengeFilter,
  DomainFilter,
  KaggleCompetition,
  TaskFilter,
} from "@/data/mockKaggleData";

export interface CompetitionFilters {
  domain: DomainFilter;
  task: TaskFilter;
  challenge: ChallengeFilter;
}

export interface RankedCompetition {
  competition: KaggleCompetition;
  matchRate: number | null;
}

type TagDimension = "domain" | "task" | "challenge";

function getSelectedTags(
  filters: CompetitionFilters,
): { dimension: TagDimension; value: string }[] {
  const tags: { dimension: TagDimension; value: string }[] = [];
  if (filters.domain !== "All") {
    tags.push({ dimension: "domain", value: filters.domain });
  }
  if (filters.task !== "All") {
    tags.push({ dimension: "task", value: filters.task });
  }
  if (filters.challenge !== "All") {
    tags.push({ dimension: "challenge", value: filters.challenge });
  }
  return tags;
}

function countMatchingTags(
  competition: KaggleCompetition,
  selected: { dimension: TagDimension; value: string }[],
): number {
  return selected.reduce((count, tag) => {
    if (tag.dimension === "domain" && competition.domain === tag.value) {
      return count + 1;
    }
    if (tag.dimension === "task" && competition.task === tag.value) {
      return count + 1;
    }
    if (tag.dimension === "challenge" && competition.challenge === tag.value) {
      return count + 1;
    }
    return count;
  }, 0);
}

/** (matching tags / selected tags) × 100; null when nothing is selected */
export function computeMatchRate(
  competition: KaggleCompetition,
  filters: CompetitionFilters,
): number | null {
  const selected = getSelectedTags(filters);
  if (selected.length === 0) return null;

  const matches = countMatchingTags(competition, selected);
  return Math.round((matches / selected.length) * 100);
}

export function hasActiveConstraints(filters: CompetitionFilters): boolean {
  return getSelectedTags(filters).length > 0;
}

export function rankCompetitions(
  data: KaggleCompetition[],
  filters: CompetitionFilters,
): RankedCompetition[] {
  const ranked = data.map((competition) => ({
    competition,
    matchRate: computeMatchRate(competition, filters),
  }));

  const active = hasActiveConstraints(filters);

  if (!active) {
    return ranked.sort(
      (a, b) => b.competition.listedOrder - a.competition.listedOrder,
    );
  }

  return ranked.sort((a, b) => {
    const rateA = a.matchRate ?? 0;
    const rateB = b.matchRate ?? 0;
    if (rateB !== rateA) return rateB - rateA;
    return b.competition.listedOrder - a.competition.listedOrder;
  });
}

export function getMatchBadgeStyle(matchRate: number): {
  emoji: string;
  className: string;
} {
  if (matchRate >= 100) {
    return {
      emoji: "🟢",
      className:
        "border-emerald-500/50 bg-emerald-500/15 text-emerald-300",
    };
  }
  if (matchRate >= 50) {
    return {
      emoji: "🟡",
      className: "border-amber-500/50 bg-amber-500/15 text-amber-300",
    };
  }
  return {
    emoji: "🟠",
    className: "border-orange-500/50 bg-orange-500/15 text-orange-300",
  };
}
