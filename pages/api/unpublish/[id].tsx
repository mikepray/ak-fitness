// pages/api/unpublish/[id].ts

import { Session, getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { nextAuthOptions } from "../auth/[...nextauth]";
import { putAuthed } from "../../../lib/requestHandler";

// PUT /api/unpublish/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await putAuthed(req, res, true, async ({idQueryParam}) => {
    const post = await prisma.post.update({
      where: { id: idQueryParam },
      data: { published: false },
    });
    res.json(post);
  });
}