// pages/api/post/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { deleteAuthed, getAuthed, putAuthed } from "../../../../lib/requestHandler";

// DELETE /api/workout/:id
// PUT /api/workout/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  getAuthed(req, res, false, async ({ res, idQueryParam }) => {
    const post = await prisma.workoutExercise.findMany({
      where: { workoutId: idQueryParam },
    });
    res.json(post);
  });
}
