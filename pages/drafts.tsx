// pages/drafts.tsx

import React from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./api/auth/[...nextauth]";
import { Alert, Stack, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
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
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        <Title>Your Drafts</Title>
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          color="red"
          variant="filled"
        >
          You need to be authenticated to view this page
        </Alert>
      </>
    );
  }

  return (
    <>
      <Title p="md">Your Drafts</Title>
      <Stack spacing="md">
        {props.drafts.map((post) => (
          <div key={post.id} className="post">
            <Post post={post} />
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
