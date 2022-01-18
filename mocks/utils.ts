import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";

/**
 * Store MSW data in a file to use in an E2E test
 *
 * @param updates Key/value pairs to store in file
 * @see https://github.com/kentcdodds/kentcdodds.com/blob/883416ff9a6a53e2d0201b8ebd35c39cd15a995f/mocks/utils.ts#L25-L41
 */
export async function updateFixture(updates: Record<string, unknown>) {
  const mswDataPath = path.join(
    __dirname,
    "../../..",
    "./mocks/msw.local.json"
  );

  try {
    const contents = await fs.readFile(mswDataPath);
    const mswData = JSON.parse(contents.toString());
    const updatedMswData = { ...mswData, ...updates };

    await fs.writeFile(mswDataPath, JSON.stringify(updatedMswData, null, 2));
  } catch (error: unknown) {
    console.error(
      `Error reading and parsing the msw fixture. Clearing it.`,
      (error as { stack?: string }).stack ?? error
    );
  }
}

/**
 * Creates the file to store MSW data if it does not exist
 */
export async function createFixtureStorage(): Promise<void> {
  const mswDataPath = path.join(
    __dirname,
    "../../..",
    "./mocks/msw.local.json"
  );
  if (!existsSync(mswDataPath)) {
    await fs.appendFile(mswDataPath, "{}");
  }
}
