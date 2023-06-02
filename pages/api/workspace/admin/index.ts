// pages/api/post/index.ts

import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import { nextAuthOptions } from "../../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { postAuthed } from "../../../../lib/requestHandler";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {

  postAuthed(req, res, async ({req, res, session}) => {
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
  })
}
