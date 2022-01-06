import { digraph, INode, renderDot } from "https://deno.land/x/graphviz/mod.ts";
import { NumberedModule } from "../spec.ts";

const filename = "uses-hierarchy.pdf";

function getModuleLabel(module: NumberedModule): string {
  return `${module.codeName} (${module.moduleNumber})`;
}

export async function renderUsesHierarchy(modules: NumberedModule[]) {
  const G = digraph("G", (g) => {
    const nodes: Record<string, INode> = {};
    modules.forEach((module) => {
      nodes[getModuleLabel(module)] = g.node(getModuleLabel(module), {
        shape: "rectangle",
      });
    });
    modules.forEach((module) => {
      module.uses?.forEach((uses) => {
        g.edge([
          nodes[getModuleLabel(module)],
          nodes[
            getModuleLabel(modules.find((m) => m.codeName === uses.codeName)!)
          ],
        ]);
      });
    });
  });

  await renderDot(G, filename, { format: "pdf" });

  return filename;
}
