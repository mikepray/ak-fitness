import { Button, Card, Group, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Workout } from "@prisma/client";
import Router from "next/router";

type Props = {
  workout: Workout;
};
export const WorkoutEdit: React.FC<Props> = (props) => {
  const form = useForm({
    initialValues: {
      name: props.workout.name,
      description: props.workout.description,
      tags: props.workout.tags,
    },
    validate: {
      name: (value: String) => (value.length > 0 ? null : "Name is required"),
    },
  });

  const submitForm = async (formData: {
    name: string;
    description: string;
    tags: string;
  }) => {
    try {
      const response = await fetch(`/api/workout/${props.workout.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          tags: formData.tags,
        }),
      });
      if (response.status === 200) {
        notifications.show({
          message: `Workout updated`,
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

  const deleteWorkout = async () => {
    const response = await fetch(`/api/workout/${props.workout.id}`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      notifications.show({
        message: `Workout deleted`,
      });
    } else {
      notifications.show({
        message: `${response.status} ${response.statusText}`,
        color: "red",
      });
    }
    Router.push("/workouts");
  };

  return (
    <Card mb={20}>
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

        <Group position="right" mt="md">
          <Button color="red" onClick={() => deleteWorkout()}>
            Delete
          </Button>
          <Button type="submit">Update</Button>
        </Group>
      </form>
    </Card>
  );
};
