import { User } from ".prisma/client";

export const TEST_USER: Partial<User> = {
  email: "test@mcmaster.ca",
  name: "Test User",
  imageUrl: "https://example.com",
};
