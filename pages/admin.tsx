import { Alert, Loader, Stack, Title, Text } from "@mantine/core";
import { GetServerSideProps, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import { IconAlertCircle } from "@tabler/icons-react";
import { User, Workspace } from "@prisma/client";
import { nextAuthOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useGetMe } from "../hooks/useGetMe";

const Blog: React.FC = () => {
  const { data: session, status } = useSession();
  const me = useGetMe();

  return (
    <>
      {status === "loading" && <Loader />}
      {session && me?.isGlobalAdmin && (
        <>
          <Title p="md">Administration</Title>
          <Stack spacing="md">You're an application administrator. Right now there's not much to do here...</Stack>
        </>
      )}
      {status !== "loading" && (!session || !me?.isGlobalAdmin) && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          color="red"
          variant="filled"
        >
          You need to be an authenticated admin to view this page
        </Alert>
      )}
    </>
  );
};

export default Blog;
