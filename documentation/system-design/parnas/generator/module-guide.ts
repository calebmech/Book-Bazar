import { ModuleType } from "../module.ts";
import { Implementer, NumberedModule } from "../spec.ts";

export function renderModuleGuide(modules: NumberedModule[]): string {
  return [
    `\\section{Module Guide}`,
    Object.values(ModuleType).map((moduleType) => {
      return [
        `\\subsection{${moduleType} Modules}`,
        renderModuleList(
          modules.filter((module) => module.type === moduleType)
        ),
      ].join("\n");
    }),
  ]
    .flat()
    .join("\n");
}

function renderModuleList(modules: NumberedModule[]) {
  if (modules.length === 0) {
    return renderModule(
      {
        secrets:
          "The data structure and algorithm used to implement the virtual hardware.",
        services:
          "Serves as a virtual hardware used by the rest of the system. This module provides the" +
          " interface between the hardware and the software. So, the system can use it to display outputs or to accept inputs.",
        implementedBy: Implementer.OS,
      } as NumberedModule,
      true
    );
  }
  return modules.map((module) => renderModule(module)).join("\n");
}

function renderModule(
  module: NumberedModule,
  ignoreHeading: boolean = false
): string {
  const lines = [];

  if (!ignoreHeading) {
    lines.push(
      ...[
        `\\subsubsection{${module.name} Module (\\hyperref[module:${module.codeName}]{${module.moduleNumber}})}`,
        `\\label{module:${module.moduleNumber}}`,
      ]
    );
  }
  lines.push(
    ...[
      `\\begin{description}`,
      `\\item[Secrets:] ${module.secrets}`,
      `\\item[Services:] ${module.services}`,
      `\\item[Implemented by:] ${renderImplementedBy(module)}`,
      `\\end{description}`,
    ]
  );

  return lines.join("\n");
}

function renderImplementedBy(module: NumberedModule) {
  if (module.implementedBy === Implementer.BOOK_BAZAR) {
    return `\\href{https://github.com/calebmech/Book-Bazar/blob/main${module.path}}{${module.implementedBy}}`;
  }

  return module.implementedBy;
}
