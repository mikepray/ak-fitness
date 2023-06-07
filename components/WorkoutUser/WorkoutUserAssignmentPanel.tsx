import { Button, Group, Paper, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { v4 as uuidv4 } from "uuid";
import {
  NewWorkoutUser,
  WorkoutIncludingWorkoutExercises,
} from "../../types/types";
import {
  UserIncludingWorkoutUsers,
  WorkoutUserLinkTable,
} from "./WorkoutUserLinkTable";

type Props = {
  user: UserIncludingWorkoutUsers;
  workouts: WorkoutIncludingWorkoutExercises[];
};

type FormValues = {
  workoutUsers: NewWorkoutUser[];
};

export const WorkoutUserAssignmentPanel: React.FC<Props> = (props) => {
  const form = useForm<FormValues>({
    initialValues: {
      workoutUsers: props.user.workoutUsers.map((wU) => {
        return {
          key: uuidv4(),
          userId: wU.userId,
          workoutId: wU.workoutId,
        };
      }),
    },
  });

  const submitForm = async (formData: FormValues) => {
    try {
      const response = await fetch(`/api/workoutUsers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutUsers: formData.workoutUsers,
        }),
      });
      if (response.status === 200) {
        notifications.show({
          message: `Workouts updated`,
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

  const onWorkoutUserTableChange = (workoutUsers: NewWorkoutUser[]) => {
    form.setFieldValue("workoutUsers", workoutUsers);
  };

  return (
    <Paper p="md" key={uuidv4()}>
      <form onSubmit={form.onSubmit((values) => submitForm(values))}>
        <Text>{props.user.name}</Text>

        <WorkoutUserLinkTable
          user={props.user}
          workouts={props.workouts}
          initialWorkoutUsers={form.getInputProps("workoutUsers").value}
          onChange={onWorkoutUserTableChange}
        />

        <Group position="right" mt="md">
          <Button type="submit">Update</Button>
        </Group>
      </form>
    </Paper>
  );
};
