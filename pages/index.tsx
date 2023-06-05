import { Anchor, Group, Stack, Text, Title } from "@mantine/core";
import { GetStaticProps } from "next";
import React from "react";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { getServerSession } from "next-auth";
import { useGetEffect } from "../hooks/useGetEffect";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

export const getStaticProps: GetStaticProps = async () => {

  const feed = await prisma.post.findMany({
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  const { name } = await prisma.workspaceConfig.findUnique({
    where: { id: 0 }
  })
  console.log('name was', name)
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
      <Stack spacing="md">
        {props.feed.map((post) => (
          <div key={post.id}>
            <Post post={post} user={me} />
          </div>
        ))}
        {props.feed.length === 0 && (
          <Text c="dimmed">There aren't any posts yet...</Text>
        )}
        <Group position="right">
          <Anchor href="/create">Create Post</Anchor>
        </Group>
      </Stack>
    </>
  );
};

export default Blog;
