import { Button, Card, Group, Paper, Stack, Switch, TextInput, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Exercise, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useGetEffect } from "../hooks/useGetEffect";
import Router from "next/router";

type Props = {
  exercise: Exercise;
};
export const ExerciseEdit: React.FC<Props> = (props) => {  
  const form = useForm({
    initialValues: {
      name: props.exercise.name,
      description: props.exercise.description,
      tags: props.exercise.tags,
      type: props.exercise.type,
      equipmentRequired: props.exercise.equipmentRequired,
    },
    validate: {
      name: (value: String) =>
        value.length > 0 ? null : "Name is required",
      
    },
  });

  const submitForm = async (formData: {
    name: string;
    description: string;
    tags: string;
    type: string;
    equipmentRequired: string;
  }) => {
    try {
      const response = await fetch(`/api/exercise/${props.exercise.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          tags: formData.tags,
          type: formData.type,
          equipmentRequired: formData.equipmentRequired,
        }),
      });
      if (response.status === 200) {
        notifications.show({
          message: `Exercise updated`,
        });
      } else {
        notifications.show({
          message: `${response.status} ${response.statusText}`,
          color: "red",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExercise = async() => {
    const response = await fetch(`/api/exercise/${props.exercise.id}`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      notifications.show({
        message: `Exercise deleted`,
      });
    } else {
      notifications.show({
        message: `${response.status} ${response.statusText}`,
        color: "red",
      });
    }
    Router.push("/exercises")
  };

  return (
    <Paper mb={20} p="md">
      <form onSubmit={form.onSubmit((values) => submitForm(values))}>
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
        <TextInput
          label="Type"
          placeholder="Type (e.g., cardio, anerobic, etc)"
          {...form.getInputProps("type")}
        />
        <TextInput
          label="Equipment Required"
          placeholder="Equipment Required"
          {...form.getInputProps("equipmentRequired")}
        />
        <Group position="right" mt="md">
          <Button color="red" onClick={() => deleteExercise()}>Delete</Button>
          <Button type="submit">Update</Button>
        </Group>
      </form>
    </Paper>
  );
};
