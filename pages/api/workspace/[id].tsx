// pages/api/publish/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getAuthed } from "../../../lib/requestHandler";

// GET /api/workspace/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  getAuthed(req, res, async ({res, idQueryParam}) => {

    const post = await prisma.workspace.findFirst({
      where: { id: idQueryParam },
    });
    res.json(post);
  });
}
