import {
  Alert,
  Anchor,
  Group,
  Loader,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { User, Workout, WorkoutExercise, WorkoutUser } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { AuthAdminRequired } from "../components/AuthAdminRequired";
import { useGetEffect } from "../hooks/useGetEffect";
import prisma from "../lib/prisma";
import { nextAuthOptions } from "./api/auth/[...nextauth]";
import { WorkoutEdit } from "../components/WorkoutExercise/WorkoutEdit";
import WorkoutUserAssignmentModal from "../components/WorkoutUser/WorkoutUserAssignmentModal";
import {
  UserIncludingWorkoutUsers,
  WorkoutUserLinkTable,
} from "../components/WorkoutUser/WorkoutUserLinkTable";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "@mantine/form";
import { NewWorkoutUser, WorkoutIncludingWorkoutExercises } from "../types/types";
import { notifications } from "@mantine/notifications";
import { WorkoutUserAssignmentPanel } from "../components/WorkoutUser/WorkoutUserAssignmentPanel";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session) {
    res.statusCode = 403;
    return { props: { exercises: [] } };
  }

  const users = await prisma.user.findMany({
    where: { isUserEnabled: true },
    include: { workoutUsers: true },
  });

  const workouts = await prisma.workout.findMany({
    orderBy: { name: "desc" },
    include: {
      workoutExercises: true,
    },
  });
  return {
    props: { workouts, users },
  };
};

type Props = {
  workouts: WorkoutIncludingWorkoutExercises[];
  users: UserIncludingWorkoutUsers[];
};

const Workouts: React.FC<Props> = (props) => {
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
      <Group position="apart">
        <Title p="md">Workout Assignments</Title>
      </Group>
      <Stack spacing="md">
        <Text>Build a workout plan by assigning workouts to users</Text>
        {props.users?.map((user: UserIncludingWorkoutUsers) => (
          <WorkoutUserAssignmentPanel user={user} workouts={props.workouts} key={user.id} />
        ))}
      </Stack>
    </>
  );
};

export default Workouts;
