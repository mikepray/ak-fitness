import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { nextAuthOptions } from "../pages/api/auth/[...nextauth]";
import prisma from "./prisma";

export type HandlerProperties = {
  req: NextApiRequest;
  res: NextApiResponse;
  method: string;
  requireSession: boolean;
  requireGlobalAdmin: boolean;
  work: (props: CallbackProperties) => Promise<void>;
};

export type CallbackProperties = {
  session?: Session;
  user?: User;
  idQueryParam: string;
};

export async function get(
  req: NextApiRequest,
  res: NextApiResponse,
  work: ({ }: CallbackProperties) => Promise<void>
) {
  await handle({
    req: req,
    res: res,
    method: "GET",
    requireSession: false,
    requireGlobalAdmin: false,
    work: work,
  });
}

export async function getAuthed(
  req: NextApiRequest,
  res: NextApiResponse,
  requireGlobalAdmin: boolean | false,
  work: ({ session, user }: CallbackProperties) => Promise<void>
) {
  await handle({
    req: req,
    res: res,
    method: "GET",
    requireSession: true,
    requireGlobalAdmin: requireGlobalAdmin,
    work: work,
  });
}

export async function postAuthed(
  req: NextApiRequest,
  res: NextApiResponse,  
    requireGlobalAdmin: boolean | false,
  work: ({ session, user }: CallbackProperties) => Promise<void>
) {
  await handle({
    req: req,
    res: res,
    method: "POST",
    requireSession: true,
    requireGlobalAdmin: requireGlobalAdmin,
    work: work,
  });
}

export async function putAuthed(
  req: NextApiRequest,
  res: NextApiResponse,  
  requireGlobalAdmin: boolean | false,
  work: ({ session, user }: CallbackProperties) => Promise<void>
) {
  console.log('in put request')
  await handle({
    req: req,
    res: res,
    method: "PUT",
    requireSession: true,
    requireGlobalAdmin: requireGlobalAdmin,
    work: work,
  });
  console.log('done with put request')
}

export async function deleteAuthed(
  req: NextApiRequest,
  res: NextApiResponse,
  requireGlobalAdmin: boolean | false,
  work: ({ session, user }: CallbackProperties) => Promise<void>
) {
  await handle({
    req: req,
    res: res,
    method: "DELETE",
    requireSession: true,
    requireGlobalAdmin: requireGlobalAdmin,
    work: work,
  });
}

export async function handle(properties: HandlerProperties) {
  if (properties.req.method !== properties.method) {
    // properties.res.status(405).send("Method not allowed");
    return;
  }
  // perform type narrowing for id query parameters
  if (Array.isArray(properties.req.query?.id)) {
    properties.res
      .status(400)
      .send('{"error": "Only a single query parameter is supported"}')
    return;
  }

  if (properties.requireSession) {
    const session = await getServerSession(
      properties.req,
      properties.res,
      nextAuthOptions
    );

    if (!session || !session.user) {
      properties.res.status(401)
      .send('{"error": "You are not authenticated"}');
      return;
    }

    if (session && session.user) {
      const user = await prisma.user.findFirst({
        where: { email: session.user.email },
      });

      if (properties.requireGlobalAdmin && !user.isGlobalAdmin) {
        properties.res.status(401)
        .send('{"error": "You lack the required authorization"}')
        return;
      }

       await properties.work({
        session: session,
        user: user,
        idQueryParam: properties.req.query?.id,
      });
      return;
    }
  }

  await properties.work({
    idQueryParam: properties.req.query?.id,
  });
}
