// pages/api/post/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { postAuthed } from "../../../lib/requestHandler";
import { WorkoutExercise } from "@prisma/client";
import { NewWorkoutExercise } from "../../../types/types";

// POST /api/workout
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  postAuthed(req, res, true, async ({ req, res, }) => {
    const { name, description, tags } = req.body;
    const newWorkoutExercises: NewWorkoutExercise[] = req.body.workoutExercises;
    
    // create the workout
    const result = await prisma.workout.create({
      data: {
        name: name,
        description: description,
        tags: tags,
        workoutExercises: {
          createMany: {
            data: newWorkoutExercises?.map((wE) => {
              return {
                exerciseId: wE.exerciseId,
                sets: wE.sets,
                reps: wE.reps,
                restSeconds: wE.restSeconds,
              }
            })
          }
        }
      },
    });

    res.json(result);
  });
}
