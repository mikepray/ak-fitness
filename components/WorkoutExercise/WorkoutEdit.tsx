import {
  Button,
  Card,
  Group,
  Modal,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Title,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Workout, WorkoutExercise } from "@prisma/client";
import Router from "next/router";
import { WorkoutExerciseLinkTable } from "./WorkoutExerciseLinkTable";
import { NewWorkoutExercise } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  workout: Workout & { workoutExercises: WorkoutExercise[] };
};

type FormValues = {
  name: string;
  description: string;
  tags: string;
  workoutExercises: NewWorkoutExercise[];
};

export const WorkoutEdit: React.FC<Props> = (props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm<FormValues>({
    initialValues: {
      name: props.workout.name,
      description: props.workout.description,
      tags: props.workout.tags,
      workoutExercises: props.workout.workoutExercises?.map((wE) => {
        return {
          key: uuidv4(),
          workoutId: wE.workoutId,
          exerciseId: wE.exerciseId,
          sets: wE.sets,
          reps: wE.reps,
          restSeconds: wE.restSeconds,
        };
      }),
    },
    validate: {
      name: (value: String) => (value.length > 0 ? null : "Name is required"),
    },
  });

  const submitForm = async (formData: {
    name: string;
    description: string;
    tags: string;
    workoutExercises: NewWorkoutExercise[];
  }) => {
    try {
      const response = await fetch(`/api/workout/${props.workout.id}`, {
        method: "PUT",
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

  const onExerciseTableChange = (workoutExercises: NewWorkoutExercise[]) => {
    form.setFieldValue("workoutExercises", workoutExercises);
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
        <Stack mt="md">
          <Title order={3}>Exercises</Title>

          <WorkoutExerciseLinkTable
            onChange={onExerciseTableChange}
            initialWorkoutExercises={
              form.getInputProps("workoutExercises").value
            }
          />
        </Stack>
        <Modal opened={opened} onClose={close} title="Confirm Delete">
          <Stack>
            <Text>Are you sure you want to delete this workout?</Text>
            <Group position="right">
              <Button color="red" onClick={deleteWorkout}>
                Delete
              </Button>
              <Button onClick={close}>Cancel</Button>
            </Group>
          </Stack>
        </Modal>

        <Group position="right" mt="md">
          <Button color="red" variant="light" onClick={open}>
            Delete
          </Button>
          <Button type="submit">Update</Button>
        </Group>
      </form>
    </Paper>
  );
};
