// pages/api/post/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { postAuthed } from "../../../lib/requestHandler";

// POST /api/workout
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  postAuthed(req, res, true, async ({ req, res, }) => {
    const { name, description, tags,  } = req.body;
    const result = await prisma.workout.create({
      data: {
        name: name,
        description: description,
        tags: tags,
      },
    });
    res.json(result);
  });
}
