// pages/api/publish/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { putAuthed } from "../../../lib/requestHandler";

// PUT /api/publish/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  putAuthed(req, res, true, async ({ res, idQueryParam }) => {
    const post = await prisma.post.update({
      where: { id: idQueryParam },
      data: { published: true },
    });
    res.json(post);
  });
}
