import { Stack, Table } from "@mantine/core";
import { Exercise } from "@prisma/client";
import { useState } from "react";
import { useGetEffect } from "../../hooks/useGetEffect";
import { NewWorkoutExercise } from "../../types/types";
import WorkoutExerciseModal from "./WorkoutExerciseModal";
import { v4 as uuidv4 } from "uuid";

type Props = {
  initialWorkoutExercises?: NewWorkoutExercise[];
  onChange: (workoutExercises: NewWorkoutExercise[]) => void;
};

export const WorkoutExerciseLinkTable: React.FC<Props> = (props) => {
  const exercises = useGetEffect<Exercise[]>(`/api/exercise`, []);
  const [workoutExercises, setWorkoutExercises] = useState<
    NewWorkoutExercise[]
  >(props.initialWorkoutExercises ? props.initialWorkoutExercises : []);

  const unLinkExercise = (key: string) => {
    setWorkoutExercises(workoutExercises.filter((value) => value.key !== key));
    props.onChange(workoutExercises.filter((value) => value.key !== key));
  };
  const linkExercise = (workoutExercise: NewWorkoutExercise) => {
    setWorkoutExercises(workoutExercises.concat([workoutExercise]));
    props.onChange(workoutExercises.concat([workoutExercise]));
  };
  const updateLinkedExercise = (workoutExercise: NewWorkoutExercise) => {
    setWorkoutExercises(
      workoutExercises.map((value) =>
        value.key === workoutExercise.key ? workoutExercise : value
      )
    );
    props.onChange(
      workoutExercises.map((value) =>
        value.key === workoutExercise.key ? workoutExercise : value
      )
    );
  };

  const rows = workoutExercises.map((workoutExercise) => (
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
        <WorkoutExerciseModal
          exercises={exercises}
          onEdit={updateLinkedExercise}
          onRemove={unLinkExercise}
          initialWorkoutExercise={workoutExercise}
        />
      </td>
    </tr>
  ));

  return (
    <Stack>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Rest Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <WorkoutExerciseModal exercises={exercises} onAdd={linkExercise} initialWorkoutExercise={undefined} />
    </Stack>
  );
};
