import {
  Anchor,
  AppShell,
  Box,
  Burger,
  Center,
  Container,
  Flex,
  Group,
  Header,
  Loader,
  MediaQuery,
  Navbar,
  Stack,
  Text,
  Title,
  UnstyledButton
} from "@mantine/core";
import { IconBarbell } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { useGetMe } from "../hooks/useGetMe";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;
  const me = useGetMe();  
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const label = opened ? "Close navigation" : "Open navigation";

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
                  Feed
                </Anchor>
                {session && (
                  <>
                    <Anchor
                      href="/drafts"
                      weight={isActive("/drafts") ? "bold" : "normal"}
                    >
                      Drafts
                    </Anchor>
                    <Anchor
                      href="/create"
                      weight={isActive("/create") ? "bold" : "normal"}
                    >
                      Create Post
                    </Anchor>
                    <Anchor
                      href="/workspaces"
                      weight={isActive("/workspaces") ? "bold" : "normal"}
                    >
                      Workspaces
                    </Anchor>
                    {me?.isGlobalAdmin && (
                       <Anchor
                       href="/admin"
                       weight={isActive("/admin") ? "bold" : "normal"}
                     >
                       Application Admin
                     </Anchor>
                    )}
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
              <Group>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                ></Burger>
                <Title order={3}>AK Fitness</Title>
              </Group>
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <Group position="apart">
                <Group>
                  <Center>
                    <IconBarbell />
                  </Center>
                  <Title order={3}>AK Fitness</Title>
                  <Group mt={5}>
                  <Anchor href="/" weight={isActive("/") ? "bold" : "normal"}>
                    Feed
                  </Anchor>
                  {session && (
                    <>
                      <Anchor
                        href="/drafts"
                        weight={isActive("/drafts") ? "bold" : "normal"}
                      >
                        Drafts
                      </Anchor>
                      <Anchor
                        href="/create"
                        weight={isActive("/create") ? "bold" : "normal"}
                      >
                        Create Post
                      </Anchor>
                      <Anchor
                      href="/workspaces"
                      weight={isActive("/workspaces") ? "bold" : "normal"}
                    >
                      Workspaces
                    </Anchor>
                      {me?.isGlobalAdmin && (
                       <Anchor
                       href="/admin"
                       weight={isActive("/admin") ? "bold" : "normal"}
                     >
                       Application Admin
                     </Anchor>
                    )}
                    </>
                  )}
                  </Group>
                </Group>
                <Flex align="flex-end" gap="sm">
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
                </Flex>
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
