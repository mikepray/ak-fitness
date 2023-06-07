import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { putAuthed } from "../../../lib/requestHandler";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await putAuthed(req, res, false, async ({ user, idQueryParam }) => {
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
      res.status(200).json(user);
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
      res.status(200).json(user);
    } else {
      res.send(401);
    }
  });
}
