import {
  Anchor,
  AppShell,
  Avatar,
  Box,
  Burger,
  Center,
  Container,
  Group,
  Header,
  Loader,
  MediaQuery,
  Navbar,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { User, WorkspaceConfig } from "@prisma/client";
import { IconBarbell } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { useGetEffect } from "../hooks/useGetEffect";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;
  const { data: session, status } = useSession();
  const me = useGetEffect<User>("/api/user/me", [session]);
  const [opened, setOpened] = useState(false);
  const workspace = useGetEffect<WorkspaceConfig>("/api/workspace", [session]);

  return (
    <>
      <AppShell
        padding="md"
        styles={(theme) => ({
          main: { backgroundColor: theme.colors.dark[8] },
        })}
        navbar={
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Navbar p="md" hidden={!opened}>
              <Stack>
                <Anchor href="/" weight={isActive("/") ? "bold" : "normal"}>
                  Home
                </Anchor>
                {session && me?.isGlobalAdmin && (
                  <>
                    <Anchor
                      href="/drafts"
                      weight={isActive("/drafts") ? "bold" : "normal"}
                    >
                      Drafts
                    </Anchor>
                    <Anchor
                      href="/exercises"
                      weight={isActive("/exercises") ? "bold" : "normal"}
                    >
                      Exercises
                    </Anchor>
                    <Anchor
                      href="/workouts"
                      weight={isActive("/workouts") ? "bold" : "normal"}
                    >
                      Workouts
                    </Anchor>
                    <Anchor
                      href="/workoutAssignment"
                      weight={
                        isActive("/workoutAssignment") ? "bold" : "normal"
                      }
                    >
                      Workout Assignment
                    </Anchor>
                    <Anchor
                      href="/admin"
                      weight={isActive("/admin") ? "bold" : "normal"}
                    >
                      Admin
                    </Anchor>
                  </>
                )}
                {status === "loading" && <Loader />}
                {session && <Text>Welcome, {session?.user.name}</Text>}
                {status !== "loading" && !session && (
                  <Anchor href="/api/auth/signin">Log in</Anchor>
                )}
                {session && (
                  <UnstyledButton onClick={() => signOut()}>
                    <Anchor>Log Out</Anchor>
                  </UnstyledButton>
                )}
              </Stack>
            </Navbar>
          </MediaQuery>
        }
        header={
          <Header height={60} p="xs">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Group position="apart">
                <Group>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                  ></Burger>
                  <Title order={3}>{workspace?.name}</Title>
                </Group>
                <Avatar
                  src={session?.user.image}
                  radius="xl"
                  alt="profile picture"
                />
              </Group>
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <Group position="apart">
                <Group>
                  <Center>
                    <IconBarbell />
                  </Center>
                  <Title order={3}>{workspace?.name}</Title>
                  <Group mt={5}>
                    <Anchor href="/" weight={isActive("/") ? "bold" : "normal"}>
                      Home
                    </Anchor>
                    {session && me?.isGlobalAdmin && (
                      <>
                        <Anchor
                          href="/drafts"
                          weight={isActive("/drafts") ? "bold" : "normal"}
                        >
                          Drafts
                        </Anchor>
                        <Anchor
                          href="/exercises"
                          weight={isActive("/exercises") ? "bold" : "normal"}
                        >
                          Exercises
                        </Anchor>{" "}
                        <Anchor
                          href="/workouts"
                          weight={isActive("/workouts") ? "bold" : "normal"}
                        >
                          Workouts
                        </Anchor>
                        <Anchor
                          href="/workoutAssignment"
                          weight={
                            isActive("/workoutAssignment") ? "bold" : "normal"
                          }
                        >
                          Workout Assignment
                        </Anchor>
                        <Anchor
                          href="/admin"
                          weight={isActive("/admin") ? "bold" : "normal"}
                        >
                          Admin
                        </Anchor>
                      </>
                    )}
                  </Group>
                </Group>
                <Group>
                  {status === "loading" && <Loader />}
                  {session && <Text>Welcome, {session?.user.name}</Text>}
                  {status !== "loading" && !session && (
                    <Anchor href="/api/auth/signin">Log in</Anchor>
                  )}
                  {session && (
                    <UnstyledButton onClick={() => signOut()}>
                      <Anchor>Log Out</Anchor>
                    </UnstyledButton>
                  )}
                  <Avatar
                    src={session?.user.image}
                    radius="xl"
                    alt="profile picture"
                  />
                </Group>
              </Group>
            </MediaQuery>
          </Header>
        }
      >
        <Container>
          <Box maw={1024}>{props.children}</Box>
        </Container>
      </AppShell>
    </>
  );
};

export default Layout;
