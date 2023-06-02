import { Stack, Text, Title } from "@mantine/core";
import { GetStaticProps } from "next";
import React from "react";
import Post, { PostProps } from "../components/Post";
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
  return {
    props: { feed },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <>
      <Title p="md">Welcome to AK Fitness</Title>
      <Stack spacing="md">
        {props.feed.map((post) => (
          <div key={post.id}>
            <Post post={post} />
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
