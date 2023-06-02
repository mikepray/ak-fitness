import { Box, Flex, Stack, Title, Text, Container } from "@mantine/core";
import { GetStaticProps } from "next";
import React from "react";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { useMyAdminWorkspaces } from "../hooks/useMyAdminWorkspaces";

const Blog: React.FC = () => {
  const workspaces = useMyAdminWorkspaces();
  return (
    <>
      <Title p="md">Your Workspaces</Title>
      <Stack spacing="md">
        {workspaces?.map((workspace) => (
          <div key={workspace.id}>
            <Stack>
                <Text>Name: {workspace.name}</Text>
                <Text>New users can register? {workspace.canUsersRegister}</Text>
                <Text>Description: </Text>
            </Stack>
          </div>
        ))}
        {!workspaces || workspaces?.length === 0 && (
          <Text c="dimmed">You aren't a member of any workspaces...</Text>
        )}
      </Stack>
    </>
  );
};

export default Blog;
