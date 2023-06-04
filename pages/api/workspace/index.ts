// pages/api/post/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import { get } from "../../../lib/requestHandler";
import prisma from "../../../lib/prisma";

// GET /api/workspace/
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {

  get(req, res, async ({res, user}) => {
      const workspaceConfig = await prisma.workspaceConfig.findUniqueOrThrow({
        where: {
          id: 0
        }
        },
      );
      res.json(workspaceConfig);
    }
  );
}
