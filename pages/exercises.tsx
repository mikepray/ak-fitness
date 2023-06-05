// pages/drafts.tsx

import { Alert, Anchor, Group, Loader, Stack, Title } from "@mantine/core";
import { Exercise, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { AuthAdminRequired } from "../components/AuthAdminRequired";
import { ExerciseEdit } from "../components/ExerciseEdit";
import { useGetEffect } from "../hooks/useGetEffect";
import prisma from "../lib/prisma";
import { nextAuthOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session) {
    res.statusCode = 403;
    return { props: { exercises: [] } };
  }

  const exercises = await prisma.exercise.findMany({});
  return {
    props: { exercises },
  };
};

type Props = {
  exercises: Exercise[];
};

const Exercises: React.FC<Props> = (props) => {
  const { data: session, status } = useSession({ required: true });
  const me = useGetEffect<User>("/api/user/me", [session]);

  if (status === "loading" || !session || !me) {
    return <Loader />;
  }

  if (!me.isGlobalAdmin) {
    return <AuthAdminRequired />;
  }

  return (
    <>
      <Title p="md">Exercises</Title>
      <Stack spacing="md">
        {props.exercises.map((exercise) => (
          <div key={exercise.id} className="exercise">
            <ExerciseEdit exercise={exercise} />
          </div>
        ))}
        {props.exercises.length === 0 && (
          <Alert color="blue" variant="light">
            There are no exercises defined. Click Create Exercise to start
          </Alert>
        )}
        <Group position="right">
          <Anchor href="/createExercise">Create Exercise</Anchor>
        </Group>
      </Stack>
    </>
  );
};

export default Exercises;
