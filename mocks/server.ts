import { StatusCodes } from "http-status-codes";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { updateFixture } from "./utils";

export const handlers = [
  rest.post("https://api.sendgrid.com/v3/mail/send", async (req, res, ctx) => {
    await updateFixture({ email: req.body });

    return res(ctx.status(StatusCodes.OK));
  }),
];

const server = setupServer(...handlers);

server.listen({ onUnhandledRequest: "warn" });
console.info("🔶 Mock server installed");
// if (process.env.RUNNING_E2E === "true")
process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
