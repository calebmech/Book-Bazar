import type { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from "http-status-codes";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(StatusCodes.BAD_REQUEST).json(null);
}