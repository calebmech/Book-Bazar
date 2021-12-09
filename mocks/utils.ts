import path from "path";
import fs from "fs";

// https://github.com/kentcdodds/kentcdodds.com/blob/883416ff9a6a53e2d0201b8ebd35c39cd15a995f/mocks/utils.ts#L25-L41
export async function updateFixture(updates: Record<string, unknown>) {
  console.log({ update: (updates["email"] as any).content[0] });
  const mswDataPath = path.join(
    "/Users/calebmech/Developer/Book-Bazar/mocks/msw.local.json"
  );
  let mswData = {};
  try {
    const contents = await fs.promises.readFile(mswDataPath);
    mswData = JSON.parse(contents.toString());
  } catch (error: unknown) {
    console.error(
      `Error reading and parsing the msw fixture. Clearing it.`,
      (error as { stack?: string }).stack ?? error
    );
  }
  await fs.promises.writeFile(
    mswDataPath,
    JSON.stringify({ ...mswData, ...updates }, null, 2)
  );
}
