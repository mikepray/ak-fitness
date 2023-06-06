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
    const { name, description, tags, workoutExercises} = req.body;
    await prisma.workoutExercise.deleteMany({
      where: { workoutId: idQueryParam }
    })
    const post = await prisma.workout.update({
      where: { id: idQueryParam },
      data: {
        name: name,
        description: description,
        tags: tags,
        workoutExercises: {
          createMany: {
            data: workoutExercises?.map((wE) => {
              return {
                exerciseId: wE.exerciseId,
                sets: wE.sets,
                reps: wE.reps,
                restSeconds: wE.restSeconds,
              }
            })
          }
        }
      }
    });
    res.json(post);
  });
}
