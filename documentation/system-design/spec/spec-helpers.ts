import { Module } from "./module.ts";

export function generateSwaggerHref(label: string) {
  return `\\href{https://www.bookbazar.me/api/swagger?docExpansion=none#/${label}}{\\texttt{https://bookbazar.me/api/swagger\\#/${label}}}`;
}

export function moduleReference(module: Module) {
  return `\\hyperref[module:${module.codeName}]{${module.codeName}}`;
}

export function npmLink(module: string) {
  return `\\href{https://www.npmjs.com/package/${module}}{${module}}`;
}
