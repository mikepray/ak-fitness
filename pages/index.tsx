import { Stack, Text, Title } from "@mantine/core";
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
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();
  const me = useGetEffect<User>("/api/user/me", [session]);
 
  return (
    <>
      <Title p="md">Welcome to AK Fitness</Title>
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
