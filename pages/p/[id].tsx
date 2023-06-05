// pages/p/[id].tsx

import { Container, Paper, Text, Title } from "@mantine/core";
import { User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { AdminPostActions } from "../../components/AdminPostActions";
import { PostProps } from "../../components/Post";
import { useGetEffect } from "../../hooks/useGetEffect";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  const me = useGetEffect<User>("/api/user/me", [session]);

  return (
    <>
      {status !== "loading" && (
        <Container>
          <Paper shadow="md" p="md" withBorder maw={1024}>
            <Title>
              {props.title}
              {!props.published && "Draft"}
            </Title>
            <Text c="dimmed">By {props?.author?.name || "Unknown author"}</Text>
            <ReactMarkdown children={props.content} />
            {me?.isGlobalAdmin && (
              <AdminPostActions
                id={props.id}
                published={props.published}
                routeAfterAction={{
                  onPublish: `/p/${props.id}`,
                  onUnpublish: `/p/${props.id}`,
                  onDelete: `/`,
                }}
              />
            )}
          </Paper>
        </Container>
      )}
    </>
  );
};

export default Post;
