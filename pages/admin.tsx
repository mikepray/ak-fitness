import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  Group,
  Loader,
  Slider,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { User, WorkspaceConfig } from "@prisma/client";
import { IconAlertCircle } from "@tabler/icons-react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { useGetEffect } from "../hooks/useGetEffect";
import prisma from "../lib/prisma";
import { nextAuthOptions } from "./api/auth/[...nextauth]";
import { notifications } from "@mantine/notifications";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  try {
    const workspace = await prisma.workspaceConfig.findUniqueOrThrow({
      where: {
        id: 0,
      },
    });

    const users = await prisma.user.findMany({});
    return {
      props: { workspace: workspace, users: users },
    };
  } catch (e) {
    res.statusCode = 500;
    return { props: {} };
  }
};

type Props = {
  workspace: WorkspaceConfig;
  users: User[];
};

const Blog: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();
  const me = useGetEffect<User>("/api/user/me", [session]);

  const form = useForm({
    initialValues: {
      workspaceName: props.workspace.name,
      workspaceDescription: props.workspace.description,
      canUsersRegister: props.workspace.canUsersRegister,
    },
    validate: {
      workspaceName: (value: String) =>
        value.length > 0 ? null : "Workspace name is required",
    },
  });

  const submitData = async (formData: {
    workspaceName: string;
    workspaceDescription: string;
    canUsersRegister: boolean;
  }) => {
    try {
      await fetch(`/api/workspace/0`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.workspaceName,
          description: formData.workspaceDescription,
          canUsersRegister: formData.canUsersRegister,
        }),
      });

      notifications.show({
        message: "Workspace saved"
      })
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {status === "loading" && <Loader />}
      {session && me?.isGlobalAdmin && (
        <>
          <form onSubmit={form.onSubmit((values) => submitData(values))}>
            <Title p="md">Administration</Title>

            <Stack spacing="md">
              <Accordion variant="separated" chevronPosition="left">
                <Accordion.Item value="Workspace">
                  <Accordion.Control>Workspace</Accordion.Control>
                  <Accordion.Panel>
                    <TextInput
                      withAsterisk
                      label="Workspace Name"
                      placeholder="Workspace Name"
                      {...form.getInputProps("workspaceName")}
                    />
                    <Textarea
                      label="Description"
                      placeholder="Description"
                      minRows={3}
                      {...form.getInputProps("workspaceDescription")}
                    />
                    <Group mt="md">
                      <Switch
                        label="New user registration allowed?"
                        onLabel="Yes"
                        offLabel="No"
                        labelPosition="left"
                        {...form.getInputProps("canUsersRegister", {
                          type: "checkbox",
                        })}
                      />
                    </Group>
                    <Group position="right" mt="md">
                      <Button type="submit">Update</Button>
                    </Group>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              {/*workspaces?.map((workspace) => (
              <Accordion variant="separated" chevronPosition="left">
                <Accordion.Item value={workspace.name}>
                  <Accordion.Control>{workspace.name}</Accordion.Control>
                  <Accordion.Panel>
                    <Text>ID: {workspace.id}</Text>
                    <Text>Name: {workspace.name}</Text>
                    <Text>Description: {workspace.description}</Text>
                    <Text>
                      Can users register? {workspace.canUsersRegister}
                    </Text>
                    <Title order={5}>Users in Workspace:</Title>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            ))*/}
            </Stack>
          </form>
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
