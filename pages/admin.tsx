import {
  Accordion,
  Alert,
  Button,
  Group,
  Loader,
  Stack,
  Switch,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { User, WorkspaceConfig } from "@prisma/client";
import { IconAlertCircle } from "@tabler/icons-react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { UserEdit } from "../components/UserEdit";
import { useGetEffect } from "../hooks/useGetEffect";
import prisma from "../lib/prisma";
import { nextAuthOptions } from "./api/auth/[...nextauth]";

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

const Admin: React.FC<Props> = (props) => {
  const { data: session, status } = useSession({required: true});
  const me = useGetEffect<User>("/api/user/me", [session]);

  const workspaceForm = useForm({
    initialValues: {
      workspaceName: props.workspace?.name,
      workspaceDescription: props.workspace?.description,
      canUsersRegister: props.workspace?.canUsersRegister,
    },
    validate: {
      workspaceName: (value: String) =>
        value.length > 0 ? null : "Workspace name is required",
    },
  });

  const submitWorkspaceForm = async (formData: {
    workspaceName: string;
    workspaceDescription: string;
    canUsersRegister: boolean;
  }) => {
    try {
      const response = await fetch(`/api/workspace/0`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.workspaceName,
          description: formData.workspaceDescription,
          canUsersRegister: formData.canUsersRegister,
        }),
      });

      notifications.show({
        message: "Workspace successfully updated",
      });

      if (response.status === 200) {
        notifications.show({
          message: `Workspace successfully updated`,
        });
      } else {
        notifications.show({
          message: `${response.status} ${response.statusText}`,
          color: "red",
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        message: "There was a problem taking the action",
      });
    }
  };

  return (
    <>
      {status === "loading" && <Loader />}
      {session && me?.isGlobalAdmin && (
        <>
          <Title p="md">Administration</Title>

          <Stack spacing="md">
            <Accordion
              variant="separated"
              chevronPosition="left"
              defaultValue="Workspace"
            >
              <Accordion.Item value="Workspace">
                <form
                  onSubmit={workspaceForm.onSubmit((values) =>
                    submitWorkspaceForm(values)
                  )}
                >
                  <Accordion.Control>Workspace</Accordion.Control>
                  <Accordion.Panel>
                    <TextInput
                      withAsterisk
                      label="Workspace Name"
                      placeholder="Workspace Name"
                      {...workspaceForm.getInputProps("workspaceName")}
                    />
                    <Textarea
                      label="Description"
                      placeholder="Description"
                      minRows={3}
                      {...workspaceForm.getInputProps("workspaceDescription")}
                    />
                    <Group mt="md">
                      <Switch
                        label="New user registration allowed?"
                        onLabel="Yes"
                        offLabel="No"
                        labelPosition="left"
                        {...workspaceForm.getInputProps("canUsersRegister", {
                          type: "checkbox",
                        })}
                      />
                    </Group>
                    <Group position="right" mt="md">
                      <Button type="submit">Update</Button>
                    </Group>
                  </Accordion.Panel>
                </form>
              </Accordion.Item>

              <Accordion.Item value="Users">
                <Accordion.Control>Users</Accordion.Control>
                <Accordion.Panel>
                  {props.users?.map((user) => (
                    <UserEdit user={user} key={user.email}/>
                  ))}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </>
      )}
      {!me?.isGlobalAdmin && (
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

export default Admin;
