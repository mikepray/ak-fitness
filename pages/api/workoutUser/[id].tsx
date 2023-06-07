// pages/api/post/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { putAuthed } from "../../../lib/requestHandler";
import { NewWorkoutUser } from "../../../types/types";

// PUT /api/workoutUser/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await putAuthed(req, res, true, async ({ idQueryParam }) => {
    const { workoutUsers } = req.body;
    if (workoutUsers === undefined) {
      res.status(400).json("{'message': 'workoutUsers is required'}");
    }
    const workoutUsersReq = workoutUsers as NewWorkoutUser[];
    console.log(JSON.stringify(workoutUsersReq));
    // delete all the join table rows associated with the user
    try {
      await prisma.workoutUser.deleteMany({
        where: { userId: idQueryParam },
      });

      for (var workoutUser of workoutUsersReq) {
        // add them back
        await prisma.workoutUser.createMany({
          data: {
            userId: idQueryParam,
            workoutId: workoutUsersReq[0].workoutId,
          },
        });

      }

    } catch (e) {
      console.error(e);
      res.status(500);
      return;
    }
    res.status(200).json("{'message': 'success'}");
  });

}
