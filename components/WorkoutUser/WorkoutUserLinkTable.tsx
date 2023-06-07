import { Button, Stack, Table } from "@mantine/core";
import { Exercise, User, Workout, WorkoutExercise } from "@prisma/client";
import { useState } from "react";
import { useGetEffect } from "../../hooks/useGetEffect";
import { NewWorkoutUser, UserIncludingWorkoutUsers, WorkoutIncludingWorkoutExercises } from "../../types/types";
import WorkoutUserAssignmentModal from "./WorkoutUserAssignmentModal";

type Props = {
  user: UserIncludingWorkoutUsers;
  workouts: WorkoutIncludingWorkoutExercises[];
  onChange: (workoutUser: NewWorkoutUser[]) => void;
  initialWorkoutUsers?: NewWorkoutUser[];
};

export const WorkoutUserLinkTable: React.FC<Props> = (props) => {
  const exercises = useGetEffect<Exercise[]>(`/api/exercise`, []);
  const [workoutUsers, setWorkoutUsers] = useState<NewWorkoutUser[]>(
    props.initialWorkoutUsers ? props.initialWorkoutUsers : []
  );
  const unLink = (key: string) => {
    setWorkoutUsers(workoutUsers.filter((value) => value.key !== key));
    props.onChange(workoutUsers.filter((value) => value.key !== key));
  };
  const link = (workoutUser: NewWorkoutUser) => {
    setWorkoutUsers(workoutUsers.concat([workoutUser]));
    props.onChange(workoutUsers.concat([workoutUser]));
  };
  const updateLink = (workoutUser: NewWorkoutUser) => {
    setWorkoutUsers(
      workoutUsers.map((value) =>
        value.key === workoutUser.key ? workoutUser : value
      )
    );
    props.onChange(
      workoutUsers.map((value) =>
        value.key === workoutUser.key ? workoutUser : value
      )
    );
  };

  const rows = workoutUsers.map((workoutUser: NewWorkoutUser) => {
    const workout = props.workouts.find(
      (workout: WorkoutIncludingWorkoutExercises) =>
        workout.id === workoutUser.workoutId ? workout : undefined
    );
    return (
      <tr key={workoutUser.key}>
        <td>{workout.name}</td>
        <td>
          <WorkoutUserAssignmentModal
            exercises={exercises}
            onEdit={updateLink}
            onRemove={unLink}
            initialWorkoutUser={workoutUser}
            workouts={props.workouts}
            user={props.user}
          />
        </td>
      </tr>
    );
  });

  return (
    <Stack>
      <Table>
        <thead>
          <tr>
            <th>Workout</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <WorkoutUserAssignmentModal
        exercises={exercises}
        onAdd={link}
        onRemove={unLink}
        initialWorkoutUser={undefined}
        workouts={props.workouts}
        user={props.user}
      />
    </Stack>
  );
};
