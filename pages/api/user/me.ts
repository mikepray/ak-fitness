import { NextApiRequest, NextApiResponse } from "next";
import { getAuthed } from "../../../lib/requestHandler";

// GET /api/user/me
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  getAuthed(req, res, false, async ({ res, user }) => {
    return res.json(user);
  });
}
