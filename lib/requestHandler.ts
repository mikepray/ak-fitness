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
  work: (props: CallbackProperties) => {};
};

export type CallbackProperties = {
  req: NextApiRequest;
  res: NextApiResponse;
  session?: Session;
  user?: User;
  idQueryParam: string;
};

export async function get(
  req: NextApiRequest,
  res: NextApiResponse,
  work: ({ req, res }: CallbackProperties) => {}
) {
  coolHandle({
    req: req,
    res: res,
    method: "GET",
    requireSession: false,
    work: work,
  });
}

export async function getAuthed(
  req: NextApiRequest,
  res: NextApiResponse,
  work: ({ req, res, session, user }: CallbackProperties) => {}
) {
  coolHandle({
    req: req,
    res: res,
    method: "GET",
    requireSession: true,
    work: work,
  });
}

export async function postAuthed(
  req: NextApiRequest,
  res: NextApiResponse,
  work: ({ req, res, session, user }: CallbackProperties) => {}
) {
  coolHandle({
    req: req,
    res: res,
    method: "POST",
    requireSession: true,
    work: work,
  });
}

export async function putAuthed(
  req: NextApiRequest,
  res: NextApiResponse,
  work: ({ req, res, session, user }: CallbackProperties) => {}
) {
  coolHandle({
    req: req,
    res: res,
    method: "PUT",
    requireSession: true,
    work: work,
  });
}

export async function deleteAuthed(
  req: NextApiRequest,
  res: NextApiResponse,
  work: ({ req, res, session, user }: CallbackProperties) => {}
) {
  coolHandle({
    req: req,
    res: res,
    method: "DELETE",
    requireSession: true,
    work: work,
  });
}

export async function coolHandle(properties: HandlerProperties) {
  if (properties.req.method !== properties.method) {
    // properties.res.status(405).send("Method not allowed");
    return;
  }

  if (properties.requireSession) {
    const session = await getServerSession(
      properties.req,
      properties.res,
      nextAuthOptions
    );
    if (!session || !session.user) {
      properties.res.status(401).send("You are not authenticated");
      return;
    }

    // perform type narrowing for id query parameters
    if (Array.isArray(properties.req.query?.id)) {
      properties.res
        .status(400)
        .send("Only a single query parameter is supported");
      return;
    }

    if (session && session.user) {
      const user = await prisma.user.findFirst({
        where: { email: session.user.email },
      });

      properties.work({
        req: properties.req,
        res: properties.res,
        session: session,
        user: user,
        idQueryParam: properties.req.query?.id,
      });
      return;
    }

    properties.work({
      req: properties.req,
      res: properties.res,
      idQueryParam: properties.req.query?.id,
    });
  }
}
