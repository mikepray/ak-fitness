import { Anchor, Group, Stack, Text, Title } from "@mantine/core";
import { User } from "@prisma/client";
import { GetServerSideProps, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import Post, { PostProps } from "../components/Post";
import { useGetEffect } from "../hooks/useGetEffect";
import prisma from "../lib/prisma";
import { getServerSession } from "next-auth";
import { WorkoutUserLinkTable } from "../components/WorkoutUser/WorkoutUserLinkTable";
import { nextAuthOptions } from "./api/auth/[...nextauth]";
import { NewWorkoutUser, UserIncludingWorkoutUsers, WorkoutIncludingWorkoutExercises } from "../types/types";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  const name = await prisma.workspaceConfig.findUnique({
    where: { id: 0 },
  })

  const session = await getServerSession(req, res, nextAuthOptions);

  if (session) {
    const me = await prisma.user.findFirst({
      where: { email: session.user.email },
      include: {
        workoutUsers: true,
      },
    });

    const workouts = await prisma.workout.findMany({
      orderBy: { name: "desc" },
      include: {
        workoutExercises: true,
      },
    });
    return {
      props: { feed, name, me, workouts },
    };
  }
  return {
    props: { feed, name },
  };
};

type Props = {
  feed: PostProps[];
  workspaceName: String;
  me?: UserIncludingWorkoutUsers;
  workouts?: WorkoutIncludingWorkoutExercises[];
};

const Blog: React.FC<Props> = (props) => {

  return (
    <>
      {props.me?.isGlobalAdmin && (
        <Group position="apart">
          <Title p="md">Home</Title>

          <Anchor href="/create">Create Post</Anchor>
        </Group>
      )}

      <Stack spacing="md">
        {props.feed.map((post) => (
          <div key={post.id}>
            <Post post={post} user={props.me} />
          </div>
        ))}
        {props.feed.length === 0 && (
          <Text c="dimmed">There aren't any posts yet...</Text>
        )}
      </Stack>

      {props.me && props.workouts && (
        <Stack spacing="md" mt={20}>
          <Title order={4}>Your Workout Assignments</Title>
          <WorkoutUserLinkTable
            user={props.me}
            workouts={props.workouts}
            initialWorkoutUsers={props.me.workoutUsers}
            onChange={(a: NewWorkoutUser[]) => {}}
            readOnly={true}
          />
        </Stack>
      )}
    </>
  );
};

export default Blog;
