import { NumberedModule } from "../spec.ts";

export default function renderTraceabilityMatrix(
  modules: NumberedModule[],
  requirements: string[]
): string {
  return `
    \\begin{table}[H]
    \\begin{tabular}{p{0.2\\textwidth} p{0.4\\textwidth}}
    \\toprule
    \\textbf{Requirement} & \\textbf{Modules}\\\\
    \\midrule
    ${requirements
      .map(
        (req) =>
          [
            req,
            modules
              .filter((module) => module.associatedRequirements.includes(req))
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
