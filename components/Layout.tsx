import React, { ReactNode } from "react";
import {
  Anchor,
  AppShell,
  Button,
  Flex,
  Group,
  Header,
  Loader,
  Navbar,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { IconBarbell } from '@tabler/icons-react';


type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  return (
    <>
      <AppShell
        padding="md"
        header={
          <Header height={60} p="xs">
            <Group position="apart">
              <Flex align="flex-start" p="xs" gap="sm">
                <IconBarbell />
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
                  </>
                )}
              </Flex>
              <Flex align="flex-end" p="xs" gap="sm">
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
          </Header>
        }
      >
        <div className="layout">{props.children}</div>
      </AppShell>
    </>
  );
};

export default Layout;
