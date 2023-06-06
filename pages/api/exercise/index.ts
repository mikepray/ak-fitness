// pages/api/post/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getAuthed, postAuthed } from "../../../lib/requestHandler";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  postAuthed(req, res, true, async ({ req, res }) => {
    const { name, description, tags, type, equipmentRequired } = req.body;
    const result = await prisma.exercise.create({
      data: {
        name: name,
        description: description,
        tags: tags,
        type: type,
        equipmentRequired: equipmentRequired,
      },
    });
    res.json(result);
  });

  getAuthed(req, res, true, async ({ req, res }) => {
    const result = await prisma.exercise.findMany();
    res.json(result);
  });
}
