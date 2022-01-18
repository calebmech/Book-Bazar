import { StatusCodes } from "http-status-codes";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { updateFixture } from "./utils";

const handlers = [
  rest.post("https://api.sendgrid.com/v3/mail/send", async (req, res, ctx) => {
    await updateFixture({ email: req.body });

    return res(ctx.status(StatusCodes.OK));
  }),
  rest.post(
    `https://${process.env.AWS_BUCKET_NAME_BOOKBAZAR}.s3.${process.env.AWS_REGION_BOOKBAZAR}.amazonaws.com/*`,
    async (req, res, ctx) => {
      return res(ctx.status(StatusCodes.OK));
    }
  ),
  rest.delete(
    `https://${process.env.AWS_BUCKET_NAME_BOOKBAZAR}.s3.${process.env.AWS_REGION_BOOKBAZAR}.amazonaws.com/*`,
    async (req, res, ctx) => {
      return res(ctx.status(StatusCodes.OK));
    }
  ),
];

export const server = setupServer(...handlers);
