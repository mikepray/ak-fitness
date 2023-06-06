import { Anchor, Group, Stack, Text, Title } from "@mantine/core";
import { User } from "@prisma/client";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import Post, { PostProps } from "../components/Post";
import { useGetEffect } from "../hooks/useGetEffect";
import prisma from "../lib/prisma";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  const { name } = await prisma.workspaceConfig.findUnique({
    where: { id: 0 },
  });
  return {
    props: { feed, name },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
  workspaceName: String;
};

const Blog: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();
  const me = useGetEffect<User>("/api/user/me", [session]);

  return (
    <>
      {session && me?.isGlobalAdmin && (
        <Group position="apart">
          <Title p="md">Home</Title>

          <Anchor href="/create">Create Post</Anchor>
        </Group>
      )}

      <Stack spacing="md">
        {props.feed.map((post) => (
          <div key={post.id}>
            <Post post={post} user={me} />
          </div>
        ))}
        {props.feed.length === 0 && (
          <Text c="dimmed">There aren't any posts yet...</Text>
        )}
      </Stack>
    </>
  );
};

export default Blog;
