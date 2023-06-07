import { Stack, Table } from "@mantine/core";
import { Exercise, Workout } from "@prisma/client";
import { useState } from "react";
import { useGetEffect } from "../../hooks/useGetEffect";
import { NewWorkoutExercise } from "../../types/types";
import WorkoutExerciseModal from "./WorkoutExerciseModal";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "@mantine/form";

type Props = {
  initialWorkoutExercises?: NewWorkoutExercise[];
  onChange?: (workoutExercises: NewWorkoutExercise[]) => void;
  readOnly?: boolean | false;
  // workoutId: string;
  // workouts: Workout[];  
};

type FormValues = {
  workoutExercises: NewWorkoutExercise[];
};

export const WorkoutExerciseLinkTable: React.FC<Props> = (props) => {
  const exercises = useGetEffect<Exercise[]>(`/api/exercise`, []);

  const form = useForm<FormValues>({
    initialValues: {
      workoutExercises: props.initialWorkoutExercises
        ? props.initialWorkoutExercises
        : [],
    },
  });

  const unLinkExercise = (key: string) => {
    const newWorkoutExercises = form
      .getInputProps("workoutExercises")
      .value.filter((value) => value.key !== key);

    form.setFieldValue("workoutExercises", newWorkoutExercises);
    props.onChange(newWorkoutExercises);
  };
  const linkExercise = (workoutExercise: NewWorkoutExercise) => {
    const newWorkoutExercises = form
      .getInputProps("workoutExercises")
      .value.concat([workoutExercise]);
    form.setFieldValue("workoutExercises", newWorkoutExercises);
    props.onChange(newWorkoutExercises);
  };
  const updateLinkedExercise = (workoutExercise: NewWorkoutExercise) => {
    const newWorkoutExercises = form
      .getInputProps("workoutExercises")
      .value.map((value) =>
        value.key === workoutExercise.key ? workoutExercise : value
      );
    form.setFieldValue("workoutExercises", newWorkoutExercises);

    props.onChange(newWorkoutExercises);
  };

  const rows = form.values.workoutExercises.map((workoutExercise) => (
    <tr key={workoutExercise.key}>
      <td>
        {
          exercises?.find((value) => value.id === workoutExercise.exerciseId)
            ?.name
        }
      </td>
      <td>{workoutExercise.sets}</td>
      <td>{workoutExercise.reps}</td>
      <td>{workoutExercise.restSeconds}</td>
      <td>
        {!props.readOnly && (
          <WorkoutExerciseModal
            exercises={exercises}
            onEdit={updateLinkedExercise}
            onRemove={unLinkExercise}
            initialWorkoutExercise={workoutExercise}
          />
        )}
      </td>
    </tr>
  ));

  return (
    <Stack>
      <form>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Rest Time</th>
              {!props.readOnly && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        {!props.readOnly && (
          <WorkoutExerciseModal
            exercises={exercises}
            onAdd={linkExercise}
            initialWorkoutExercise={undefined}
          />
        )}
      </form>
    </Stack>
  );
};
