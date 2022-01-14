import { PrismaClient, User } from "@prisma/client";
import { TEST_USER } from "../cypress/support/constants";
import { IS_E2E } from "../lib/helpers/env";

const prisma = new PrismaClient();

async function main() {
  if (IS_E2E) {
    await prisma.user.create({
      data: TEST_USER as User,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
