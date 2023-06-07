// pages/api/post/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { postAuthed } from "../../../lib/requestHandler";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await postAuthed(req, res, true, async ({ session }) => {
    const { title, content, published } = req.body;
    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: { connect: { email: session?.user?.email } },
        published: published,
      },
    });
    res.json(result);
  });
}
