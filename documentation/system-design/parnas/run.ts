import render from "./generator/render.ts";
import { FR, modules } from "./spec.ts";
import { move } from "https://deno.land/std@0.120.0/fs/mod.ts";

const doc = await render(modules, Object.values(FR));

// console.log(doc);

await Deno.writeTextFile(
  "spec.txt",
  doc.substring(doc.indexOf("\\begin{document}"))
);

const pdflatex = Deno.run({
  cmd: ["pdflatex"],
  stdin: "piped",
});

await pdflatex.stdin.write(new TextEncoder().encode(doc));
pdflatex.stdin.close();

await pdflatex.status();

await move("texput.pdf", "spec.pdf");
