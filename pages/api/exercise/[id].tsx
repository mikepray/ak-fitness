// pages/api/post/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { deleteAuthed, putAuthed } from "../../../lib/requestHandler";

// DELETE /api/post/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await deleteAuthed(req, res, true, async ({ idQueryParam }) => {
    const post = await prisma.exercise.delete({
      where: { id: idQueryParam },
    });
    res.json(post);
  });

  await putAuthed(req, res, true, async ({ idQueryParam }) => {
    const { name, description, tags, type, equipmentRequired } = req.body;

    const post = await prisma.exercise.update({
      where: { id: idQueryParam },
      data: {
        name: name,
        description: description,
        tags: tags,
        type: type,
        equipmentRequired: equipmentRequired, 
      }
    });
    res.json(post);
  });
}
