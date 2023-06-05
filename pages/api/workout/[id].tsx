// pages/api/post/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { deleteAuthed, putAuthed } from "../../../lib/requestHandler";

// DELETE /api/workout/:id
// PUT /api/workout/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  deleteAuthed(req, res, true, async ({ res, idQueryParam }) => {
    const post = await prisma.workout.delete({
      where: { id: idQueryParam },
    });
    res.json(post);
  });


  putAuthed(req, res, true, async ({ res, idQueryParam }) => {
    const { name, description, tags, } = req.body;

    const post = await prisma.workout.update({
      where: { id: idQueryParam },
      data: {
        name: name,
        description: description,
        tags: tags,
      }
    });
    res.json(post);
  });
}
