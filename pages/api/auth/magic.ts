import { HttpMethod } from "@lib/http-method";
import { sendMagicLink } from "@lib/services/magic";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

const MCMASTER_EMAIL_SUFFIX = "@mcmaster.ca";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method as HttpMethod) {
    case HttpMethod.POST:
      return sendMagicLinkHandler(req, res);
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }
}

export interface SendMagicLinkBody {
  macID: string;
}

function instanceOfSendMagicLinkBody(object: any): object is SendMagicLinkBody {
  return typeof object === "object" && typeof object.macID === "string";
}

async function sendMagicLinkHandler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;

  if (!instanceOfSendMagicLinkBody(body)) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  const email = body.macID + MCMASTER_EMAIL_SUFFIX;
  await sendMagicLink(email);

  return res.status(StatusCodes.OK).end();
}
