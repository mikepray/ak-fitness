import { NextApiRequest, NextApiResponse } from "next";
import { getAuthed } from "../../../lib/requestHandler";

// GET /api/user/me
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
 await getAuthed(req, res, false, async ({ user }) => {
    return res.status(200).json(user);
  });
}
