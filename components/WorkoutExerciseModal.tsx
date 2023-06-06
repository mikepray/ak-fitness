import {
  Anchor,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Exercise } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { NewWorkoutExercise } from "../types/types";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  exercises: Exercise[];
  onAdd?: (workoutExercise: NewWorkoutExercise) => void; // exclusive of onEdit
  onEdit?: (workoutExercise: NewWorkoutExercise) => void;
  onRemove?: (key: string) => void;
  initialWorkoutExercise?: NewWorkoutExercise;
};

const WorkoutExerciseModal: React.FC<Props> = (props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<NewWorkoutExercise>({
    initialValues: {
      key: props.initialWorkoutExercise?.key
        ? props.initialWorkoutExercise.key
        : uuidv4(),
      exerciseId: props.initialWorkoutExercise?.exerciseId,
      sets: props.initialWorkoutExercise?.sets,
      reps: props.initialWorkoutExercise?.reps,
      restSeconds: props.initialWorkoutExercise?.restSeconds,
    },
  });

  return (
    <>
      <Modal opened={opened} onClose={close} title="Link an Exercise">
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
            {...form.getInputProps("exerciseId")}
          />
          <TextInput
            label="Sets"
            placeholder="Sets"
            {...form.getInputProps("sets")}
          />
          <TextInput
            label="Reps"
            placeholder="Reps"
            {...form.getInputProps("reps")}
          />
          <TextInput
            label="Rest Time"
            placeholder="Rest Time"
            {...form.getInputProps("restSeconds")}
          />
          <Group position="right">
            <Button
              variant="filled"
              onClick={() => {
                close();
                if (props.onEdit) {
                  props.onEdit(form.values);
                } else {
                  props.onAdd(form.values);
                };
              }}
            >
              Link
            </Button>
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
      {props.onEdit && (
        <Group>
          <Anchor onClick={open}>Edit</Anchor> |
          <Anchor
            onClick={() => {
              props.onRemove(form.values.key);
            }}
          >
            Remove
          </Anchor>
        </Group>
      )}

      {props.onAdd && (
        <Button onClick={open} variant="default">
          Add Exercise
        </Button>
      )}
    </>
  );
};

export default WorkoutExerciseModal;
