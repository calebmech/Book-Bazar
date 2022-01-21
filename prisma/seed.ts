import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { updateDatabase } from "../bookstore-scrapper/database/updateDatabase";

const prisma = new PrismaClient();

async function main() {
  const rawData = await fs.readFile(
    path.join("bookstore-scrapper/data.json"),
    "utf-8"
  );
  const data = JSON.parse(rawData).Data;

  await updateDatabase(data);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
