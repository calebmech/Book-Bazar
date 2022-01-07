import { NumberedModule } from "./spec.ts";

export interface AnticipatedChange {
  change: string;
  relatedModules: NumberedModule[];
}

interface NumberedAnticipatedChange extends AnticipatedChange {
  changeNumber: string;
}

export default function renderAnticipatedChanges(
  modules: NumberedModule[],
  likelyChanges: AnticipatedChange[],
  unlikelyChanges: AnticipatedChange[]
) {
  const numberedLikelyChanges = likelyChanges.map((change, i) => ({
    changeNumber: "AC" + (i + 1),
    ...change,
  }));
  const numberedUnlikelyChanges = unlikelyChanges.map((change, i) => ({
    changeNumber: "UC" + (i + 1),
    ...change,
  }));

  return [
    "\\section{Anticipated Changes}",
    "\\subsection{Likely Changes}",
    renderChangesList(numberedLikelyChanges),
    "\\subsubsection{Traceability matrix}",
    renderTraceabilityMatrix(numberedLikelyChanges),
    "\\subsection{Unlikely Changes}",
    renderChangesList(numberedUnlikelyChanges),
  ].join("\n");
}

function renderChangesList(changes: NumberedAnticipatedChange[]) {
  return [
    "\\begin{description}",
    ...changes.map(
      (change) => `\\item[${change.changeNumber}:] ${change.change}`
    ),
    "\\end{description}",
  ].join("\n");
}

function renderTraceabilityMatrix(
  changes: NumberedAnticipatedChange[]
): string {
  return `
    \\begin{table}[H]
    \\begin{tabular}{p{0.2\\textwidth} p{0.4\\textwidth}}
    \\toprule
    \\textbf{Requirement} & \\textbf{Modules}\\\\
    \\midrule
    ${changes
      .map(
        (change) =>
          [
            change.changeNumber,
            change.relatedModules
              .map(
                (module) =>
                  `\\hyperref[module:${module.moduleNumber}]{${module.moduleNumber}}`
              )
              .join(", "),
          ].join(" & ") + " \\\\"
      )
      .join("\n")}
    \\bottomrule
    \\end{tabular}
    \\end{table}
  `;
}
