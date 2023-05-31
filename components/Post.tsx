import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { Paper, Title, Text } from "@mantine/core";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <Paper shadow="md" p="md" withBorder>
      <Title order={2}>{post.title}</Title>
      <Text>By {authorName}</Text>
      <ReactMarkdown children={post.content} />
    </Paper>
  )
};

export default Post;
