"use client";

import katex from "katex";
import { useMemo } from "react";
import "katex/dist/katex.min.css";

interface LossFormulaProps {
  formula: string;
  label?: string;
}

function toKatexInput(formula: string): string {
  return formula.replace(/^\$+|\$+$/g, "").trim();
}

export default function LossFormula({ formula, label }: LossFormulaProps) {
  const html = useMemo(() => {
    const latex = toKatexInput(formula);
    try {
      return katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
        strict: "ignore",
        trust: false,
      });
    } catch {
      return `<span class="font-serif italic text-slate-400">${latex}</span>`;
    }
  }, [formula]);

  return (
    <div className="loss-formula" role="math" aria-label={label ?? "Loss formula"}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
