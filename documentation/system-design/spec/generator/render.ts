import { renderUsesHierarchy } from "./uses-hierarchy.ts";
import { renderModuleGuide } from "./module-guide.ts";
import renderModuleInterfaceSpecification from "./module-interface-specification.ts";
import renderTraceabilityMatrix from "./traceability-matrix.ts";
import { likelyChanges, NumberedModule } from "../spec.ts";
import { renderDatabase } from "./database.ts";
import { DATABASE_SECTION_LABEL } from "../types.ts";
import renderAnticipatedChanges from "../anticipated-changes.ts";

export default async function render(
  modules: NumberedModule[],
  requirements: string[]
): Promise<string> {
  const usesHierarchyFilename = await renderUsesHierarchy(modules);
  // Swap comments for better performance
  const databaseDiagraphFilename = await renderDatabase();
  // const databaseDiagraphFilename = "database.pdf";

  return [
    "\\documentclass{article}",
    "\\usepackage[margin=1in]{geometry}",
    "\\usepackage{hyperref}",
    "\\usepackage{multirow}",
    "\\usepackage{booktabs}",
    "\\usepackage{tabularx}",
    "\\usepackage{graphicx}",
    "\\usepackage{float}",
    "\\begin{document}",
    renderModuleGuide(modules),
    "\\newpage",
    "\\section{Traceability Matrix}",
    "\\begin{table}[H]",
    "\\centering",
    renderTraceabilityMatrix(modules, requirements),
    "\\caption{Traceability Matrix}",
    "\\end{table}",
    "\\section{Uses Hierarchy Between Modules}",
    "\\begin{figure}[H]",
    "\\centering",
    `\\includegraphics[width=1\\textwidth]{${usesHierarchyFilename}}`,
    "\\caption{Uses Hierarchy Between Modules}",
    "\\end{figure}",
    "\\newpage",
    renderAnticipatedChanges(modules, likelyChanges, likelyChanges),
    "\\newpage",
    renderModuleInterfaceSpecification(modules),
    `\\section{Database Design} \\label{${DATABASE_SECTION_LABEL}}`,
    "\\begin{figure}[H]",
    "\\centering",
    `\\includegraphics[width=0.9\\textwidth]{${databaseDiagraphFilename}}`,
    "\\caption{Database Design}",
    "\\end{figure}",
    "\\end{document}",
  ].join("\n");
}
