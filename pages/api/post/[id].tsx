// pages/api/post/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { deleteAuthed } from "../../../lib/requestHandler";

// DELETE /api/post/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  deleteAuthed(req, res, async ({ req, res, idQueryParam }) => {
    const post = await prisma.post.delete({
      where: { id: idQueryParam },
    });
    res.json(post);
  });
}
