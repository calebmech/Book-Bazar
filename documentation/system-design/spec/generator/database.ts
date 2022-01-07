const filename = "database.pdf";
import * as path from "https://deno.land/std@0.120.0/path/mod.ts";

export async function renderDatabase() {
  const p = Deno.run({
    cmd: ["bash"],
    stdout: "piped",
    stdin: "piped",
  });

  const encoder = new TextEncoder();

  const command = `npx -q @softwaretechnik/dbml-renderer -i ${path.join(
    "..",
    "..",
    "..",
    "prisma",
    "dbml",
    "schema.dbml"
  )} -f dot | dot -Tpdf > ${filename}`;
  await p.stdin.write(encoder.encode(command));

  await p.stdin.close();
  await p.output();
  p.close();

  return filename;
}
