// pages/drafts.tsx

import { Alert, Loader, Stack, Title } from "@mantine/core";
import { User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { AuthAdminRequired } from "../components/AuthAdminRequired";
import Post, { PostProps } from "../components/Post";
import { useGetEffect } from "../hooks/useGetEffect";
import prisma from "../lib/prisma";
import { nextAuthOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { drafts },
  };
};

type Props = {
  drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
  const { data: session, status } = useSession({ required: true });
  const me = useGetEffect<User>("/api/user/me", [session]);

  if (status === "loading" || !session || !me) {
    return <Loader />;
  }

  if (!me.isGlobalAdmin) {
    return <AuthAdminRequired />;
  }
  
  return (
    <>
      <Title p="md">Your Drafts</Title>
      <Stack spacing="md">
        {props.drafts.map((post) => (
          <div key={post.id} className="post">
            <Post post={post} user={me} />
          </div>
        ))}
        {props.drafts.length === 0 && (
          <Alert color="blue" variant="light">
            There are no drafts. Click Create Post to create a draft
          </Alert>
        )}
      </Stack>
    </>
  );
};

export default Drafts;
