// pages/api/publish/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { getAuthed } from "../../../../lib/requestHandler";

// GET /api/workspace/admin/me
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  getAuthed(req, res, async ({res, user}) => {
    const myWorkspaces = await prisma.workspace.findMany({
      where: {
        workspaceUsers: {
          some: {
            userId: user.id,
            isWorkspaceAdmin: true,
          },
        },
      },
      include: {
        workspaceUsers: {
          select: {
            userId: true,
            user: true,
            isUserEnabled: true,
            isWorkspaceAdmin: true,
          },
        },
      },
    });
    res.json(myWorkspaces);
  });
}
