import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { Exercise } from "@prisma/client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NewWorkoutExercise } from "../types/types";

type Props = {
  exercises: Exercise[];
  onSubmit: (workoutExercise: NewWorkoutExercise) => void;
  close: () => void;
};

const WorkoutExerciseModal: React.FC<Props> = (props) => {
  const [exerciseId, setExerciseId] = useState<string>();
  const [sets, setSets] = useState<string>();
  const [reps, setReps] = useState<string>();
  const [restSeconds, setRestSeconds] = useState<string>();
  const key = uuidv4();

  const linkExercise = () => {
    props.close();
    props.onSubmit({ key, exerciseId, sets, reps, restSeconds });
  };

  return (
    <Stack>
      <Select
        label="Find an Exercise"
        placeholder="Search"
        searchable
        nothingFound="No matching exercises..."
        data={props.exercises?.map((exercise) => {
          return {
            value: exercise.id,
            label: exercise.name,
            name: exercise.name,
          };
        })}
        value={exerciseId}
        onChange={setExerciseId}
      />
      <TextInput
        label="Sets"
        placeholder="Sets"
        value={sets}
        onChange={(event) => setSets(event.currentTarget.value)}
      />
      <TextInput
        label="Reps"
        placeholder="Reps"
        value={reps}
        onChange={(event) => setReps(event.currentTarget.value)}
      />
      <TextInput
        label="Rest Time"
        placeholder="Rest Time"
        value={restSeconds}
        onChange={(event) => setRestSeconds(event.currentTarget.value)}
      />
      <Group position="right">
        <Button variant="filled" onClick={linkExercise}>
          Link
        </Button>
        <Button variant="default" onClick={props.close}>
          Cancel
        </Button>
      </Group>
    </Stack>
  );
};

export default WorkoutExerciseModal;
