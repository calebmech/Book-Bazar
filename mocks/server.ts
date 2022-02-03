import { StatusCodes } from "http-status-codes";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { updateFixture } from "./utils";
import fs from "fs/promises";
import path from "path";

const handlers = [
  rest.post("https://api.sendgrid.com/v3/mail/send", async (req, res, ctx) => {
    await updateFixture({ email: req.body });

    return res(ctx.status(StatusCodes.OK));
  }),
  rest.get(
    `https://${process.env.AWS_BUCKET_NAME_BOOKBAZAR}.s3.${process.env.AWS_REGION_BOOKBAZAR}.amazonaws.com/*`,
    async (req, res, ctx) => {
      // https://mswjs.io/docs/recipes/binary-response-type
      const imageBuffer = await fs.readFile(
        path.join(__dirname, "../../..", "cypress/fixtures/guy.jpg")
      );

      return res(
        ctx.set("Content-Length", imageBuffer.byteLength.toString()),
        ctx.set("Content-Type", "image/jpeg"),
        ctx.body(imageBuffer)
      );
    }
  ),
  rest.put(
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
