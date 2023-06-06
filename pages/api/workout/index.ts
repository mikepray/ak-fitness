// pages/api/post/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { postAuthed } from "../../../lib/requestHandler";
import { WorkoutExercise } from "@prisma/client";

// POST /api/workout
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  postAuthed(req, res, true, async ({ req, res, }) => {
    // exercises: [{exerciseId, sets, reps, restSeconds}]
    const { name, description, tags } = req.body;
    const exercises: WorkoutExercise[] = req.body.exercises;
    // create the workout
    const result = await prisma.workout.create({
      data: {
        name: name,
        description: description,
        tags: tags,
        workoutExercises: {
          createMany: {
            data: exercises
          }
        }
      },
    });

    res.json(result);
  });
}
