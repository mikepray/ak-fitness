// pages/api/post/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import { get, postAuthed, putAuthed } from "../../../lib/requestHandler";
import prisma from "../../../lib/prisma";

// PUT /api/workspace/
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  putAuthed(req, res, false, async ({ res, user, idQueryParam }) => {
    // only global admins can enable/disable users
    if (user.isGlobalAdmin) {
      const { name, isUserEnabled, isGlobalAdmin } = req.body;
      const user = await prisma.user.update({
        where: {
          id: idQueryParam,
        },
        data: {
          name: name,
          isUserEnabled: isUserEnabled,
          isGlobalAdmin: isGlobalAdmin,
        },
      });
      res.json(user);
    } else {
      res.send(401);
    }

    if (!user.isGlobalAdmin) {
      const { name } = req.body;
      const user = await prisma.user.update({
        where: {
          id: idQueryParam,
        },
        data: {
          name: name,
        },
      });
      res.json(user);
    } else {
      res.send(401);
    }
  });
}
