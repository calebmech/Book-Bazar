import { StatusCodes } from "http-status-codes";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { updateFixture } from "./utils";

const handlers = [
  rest.post("https://api.sendgrid.com/v3/mail/send", async (req, res, ctx) => {
    await updateFixture({ email: req.body });

    return res(ctx.status(StatusCodes.OK));
  }),
];

export const server = setupServer(...handlers);
