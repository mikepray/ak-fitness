import {
  Button,
  Group,
  Loader,
  Stack,
  TextInput,
  Textarea,
  Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Router from "next/router";
import React from "react";
import { AuthAdminRequired } from "../components/AuthAdminRequired";
import { ExerciseLinkTable } from "../components/ExerciseLinkTable";
import { useGetEffect } from "../hooks/useGetEffect";
import { NewWorkoutExercise } from "../types/types";

const CreateWorkout: React.FC = () => {
  const { data: session, status } = useSession({ required: true });
  const me = useGetEffect<User>("/api/user/me", [session]);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      tags: "",
      workoutExercises: [],
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
    },
  });

  const submitData = async (formData: {
    name: string;
    description: string;
    tags: string;
    workoutExercises: NewWorkoutExercise[];
  }) => {
    try {
      const response = await fetch("/api/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          tags: formData.tags,
          workoutExercises: formData.workoutExercises,
        }),
      });
      if (response.status === 200) {
        notifications.show({
          message: `Workout created`,
        });
      } else {
        notifications.show({
          message: `${response.status} ${response.statusText}`,
          color: "red",
        });
      }
      await Router.push("/workouts");
    } catch (error) {
      console.error(error);
    }
  };

  if (status === "loading" || !session || !me) {
    return <Loader />;
  }

  if (!me.isGlobalAdmin) {
    return <AuthAdminRequired />;
  }

  const onExerciseTableChange = (workoutExercises: NewWorkoutExercise[]) => {
    console.log("setting form workoutExercises to", workoutExercises);
    form.setFieldValue("workoutExercises", workoutExercises);
  };

  return (
    <>
      <form onSubmit={form.onSubmit((values) => submitData(values))}>
        <Title order={2}>New Workout</Title>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Name"
          {...form.getInputProps("name")}
        />
        <Textarea
          label="Description"
          placeholder="Description"
          minRows={5}
          {...form.getInputProps("description")}
        />
        <TextInput
          label="Tags"
          placeholder="Tags"
          {...form.getInputProps("tags")}
        />

        <Stack mt="md">
          <Title order={3}>Exercises</Title>

          <ExerciseLinkTable onChange={onExerciseTableChange} />
        </Stack>
        <Group position="right" mt="md">
          <Button type="submit">Create</Button>
        </Group>
      </form>
    </>
  );
};

export default CreateWorkout;
