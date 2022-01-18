import {
  Module,
  AccessProgram,
  Variable,
  Type,
  ModuleContents,
  TypeKind,
} from "../module.ts";
import { moduleReference } from "../spec-helpers.ts";
import { NumberedModule } from "../spec.ts";

const NA = "N/A";

export default function renderModuleInterfaceSpecification(
  modules: NumberedModule[]
): string {
  return modules.map((module) => renderModule(module)).join("\n");
}

function renderModule(module: NumberedModule): string {
  return [
    `\\section*{${module.name} Module (\\hyperref[module:${module.moduleNumber}]{${module.moduleNumber}})}`,
    `\\label{module:${module.codeName}}`,
    `\\subsection*{Module}`,
    module.codeName,
    module.path
      ? `(\\href{https://github.com/calebmech/Book-Bazar/blob/main${module.path}}{${module.path}})`
      : "",
    `\\subsection*{Uses}`,
    module.uses.length
      ? module.uses
          .map((uses) => `\\noindent` + moduleReference(uses))
          .join("\n\n")
      : NA,
    renderModuleContents(module.contents),
  ].join("\n");
}

function renderModuleContents(contents: Module["contents"]): string {
  if (typeof contents === "string") {
    return contents;
  }

  return [
    `\\subsection*{Syntax}`,
    renderSyntax(contents.syntax),
    `\\subsection*{Semantics}`,
    renderSemantics(contents),
  ].join("\n");
}

function renderSyntax(syntax: ModuleContents["syntax"]) {
  return [
    `\\subsubsection*{Exported Constants}`,
    syntax.exportedConstants?.length
      ? syntax.exportedConstants
          .map((constant) => "\\noindent " + renderVariable(constant))
          .join("\n\n")
      : NA,
    `\\subsubsection*{Exported Types}`,
    syntax.exportedTypes?.length
      ? syntax.exportedTypes
          .map((type) => "\\noindent " + renderTypeDeclaration(type))
          .join("\n\n")
      : NA,
    `\\subsubsection*{Exported Access Programs}`,
    renderAccessProgramTable(syntax.exportedAccessPrograms),
  ].join("\n");
}

function renderSemantics(module: ModuleContents) {
  const lines = [
    `\\subsubsection*{State Variables}`,
    module.semantics.stateVariables?.map(renderVariable) || NA,
  ];

  if (module.semantics.stateVariables) {
    lines.push(`\\subsubsection*{State Invariant}`);
    lines.push(module.semantics.stateInvariants?.join("\n") || NA);
  }

  lines.push(`\\subsubsection*{Assumptions}`);
  if (module.semantics.assumptions?.length) {
    lines.push(`\\begin{itemize}`);
    lines.push(
      module.semantics.assumptions.map((item) => "\\item " + item).join("\n")
    );
    lines.push(`\\end{itemize}`);
  } else {
    lines.push(NA);
  }

  if (module.syntax.exportedAccessPrograms?.length) {
    lines.push(`\\subsubsection*{Access Routine Semantics}`);
    lines.push(
      module.syntax.exportedAccessPrograms
        .map((routine) => "\\noindent " + renderAccessRoutineSemantic(routine))
        .join("\n")
    );
  }

  return lines.join("\n");
}

function renderAccessRoutineSemantic(routine: AccessProgram): string {
  const lines = [
    `${routine.name}(${Object.keys(routine.in).join(", ")}):`,
    `\\begin{itemize}`,
  ];

  if (routine.semantics.length) {
    lines.push(routine.semantics.map((item) => "\\item " + item).join("\n"));
  } else {
    lines.push("\\item " + NA);
  }

  lines.push(`\\end{itemize}`);

  return lines.join("\n\n");
}

function renderAccessProgramTable(accessPrograms?: AccessProgram[]): string {
  if (!accessPrograms || accessPrograms.length === 0) {
    return NA;
  }

  return `
    \\begin{tabular}{| l | l | l | l |}
    \\hline
    \\textbf{Routine name} & \\textbf{In} & \\textbf{Out} & \\textbf{Exceptions} \\\\
    \\hline
    ${accessPrograms
      .map(
        (fn) =>
          [
            fn.name,
            Object.values(fn.in)
              ?.map((type) => renderType(type))
              .join(", ") || NA,
            fn.out
              ? Array.isArray(fn.out)
                ? fn.out.map((type) => renderType(type)).join(" $\\lor$ ")
                : renderType(fn.out)
              : NA,
            fn.exceptions?.join(", ") || NA,
          ].join(" & ") + " \\\\\n\\hline"
      )
      .join("\n")}
    \\end{tabular}
  `;
}

function renderVariable(variable: Variable): string {
  let out = `${variable.name}: ${renderType(variable.type)}`;

  if (variable.defaultValue) {
    out += " = " + variable.defaultValue;
  }

  if (variable.description) {
    out += " -- " + variable.description;
  }

  return out;
}

function renderTypeDeclaration(type: Type): string {
  if (typeof type === "string") {
    return type + `\\label{type:${type}}`;
  }

  if (!type.name) {
    throw new Error(
      "Exported type declarations must have a type name set: " +
        JSON.stringify(type)
    );
  }

  if (type.kind === TypeKind.EXTERNAL) {
    return renderType(type);
  }

  return `${type.name} = ${renderTypeValue(type)} \\label{type:${type.name}}`;
}

function renderTypeValue(type: Type): string {
  if (typeof type === "string") {
    return "";
  }

  switch (type.kind) {
    case TypeKind.UNION: {
      return type.types.map(renderType).join(" $\\cup$ ");
    }
    case TypeKind.OR: {
      return type.types.map(renderType).join(" $\\lor$ ");
    }
    case TypeKind.TUPLE: {
      let str = "tuple of ";

      if (Object.entries(type.values).length) {
        str +=
          "(" +
          Object.entries(type.values)
            .map(([name, type]) => `${name} : ${renderType(type)}`)
            .join(", ") +
          ")";
      }

      return str;
    }
    case TypeKind.SET: {
      let str = "set of ";

      if (Array.from(type.values).length === 1) {
        str += renderType(type.values.values().next().value);
      } else {
        str +=
          "{" +
          Array.from(type.values)
            .map((value) => renderType(value))
            .join(", ") +
          "}";
      }

      return str;
    }
    case TypeKind.SEQUENCE: {
      return "seq of " + renderType(type.type);
    }
  }

  return "";
}

function renderType(type: Type): string {
  if (typeof type === "string") {
    return type;
  }

  if (!type.name) {
    return renderTypeValue(type);
  }

  switch (type.kind) {
    case TypeKind.EXTERNAL: {
      if (typeof type.customRef === "string") {
        return `\\hyperref[${type.customRef}]{${type.name}}`;
      }

      return `\\href{${type.customRef.toString()}}{${type.name}}`;
    }
  }

  return `\\hyperref[type:${type.name}]{${type.name}}`;
}
