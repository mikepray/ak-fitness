import { Group, Paper, Stack, Text, Title } from "@mantine/core";
import { User } from "@prisma/client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { AdminPostActions } from "./AdminPostActions";

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

const Post: React.FC<{ post: PostProps; user: User }> = ({ post, user }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <Paper shadow="md" p="md" withBorder>
      <Group position="apart">
        <Title order={2}>{post.title}</Title>
        {user?.isGlobalAdmin && (
          <AdminPostActions
            id={post.id}
            published={post.published}
            routeAfterAction={{
              onPublish: `/`,
              onUnpublish: `/drafts`,
              onDelete: `/${post.published ? "/" : "/drafts"}`,
            }}
          />
        )}
      </Group>
      <Stack>
        <Text c="dimmed">By {authorName}</Text>
        <ReactMarkdown children={post.content} />
      </Stack>
    </Paper>
  );
};

export default Post;
