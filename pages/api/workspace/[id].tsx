// pages/api/post/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import { get, postAuthed, putAuthed } from "../../../lib/requestHandler";
import prisma from "../../../lib/prisma";

// PUT /api/workspace/
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await putAuthed(req, res, true, async ({ user }) => {
    const { name, description, canUsersRegister } = req.body;
    const workspaceConfig = await prisma.workspaceConfig.update({
      where: {
        id: 0,
      },
      data: {
        name: name,
        description: description,
        canUsersRegister: canUsersRegister,
      },
    });
    res.json(workspaceConfig);
  });
}
