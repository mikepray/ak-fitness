import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { Stack, Title } from "@mantine/core";

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
      </Stack>
    </>
  );
};

export default Blog;
