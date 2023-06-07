import {
  Anchor,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Exercise, User, Workout } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { NewWorkoutExercise, NewWorkoutUser } from "../../types/types";
import { useDisclosure } from "@mantine/hooks";
import { WorkoutExerciseLinkTable } from "../WorkoutExercise/WorkoutExerciseLinkTable";

type Props = {
  exercises: Exercise[];
  workouts: Workout[];
  onAdd?: (workoutUser: NewWorkoutUser) => void; // exclusive of onEdit
  onEdit?: (workoutUser: NewWorkoutUser) => void; // exclusive of onAdd
  onRemove?: (key: string) => void;
  initialWorkoutUser?: NewWorkoutUser;
  user: User;
};

type FormProps = {
  key: string;
  userId: string;
  workoutId: string;
};

const WorkoutUserAssignmentModal: React.FC<Props> = (props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<FormProps>({
    initialValues: {
      key: props.initialWorkoutUser?.key
        ? props.initialWorkoutUser.key
        : uuidv4(),
      userId: props.user.id,
      workoutId: props.initialWorkoutUser?.workoutId,
    },
  });

  return (
    <>
      <Modal opened={opened} onClose={close} title="Link a Workout">
        <Stack>
          <Select
            label="Find a Workout"
            placeholder="Search"
            searchable
            nothingFound="No matching workouts..."
            data={props.workouts?.map((workout) => {
              return {
                value: workout.id,
                label: workout.name,
                name: workout.name,
              };
            })}
            {...form.getInputProps("workoutId")}
          />

          <Title order={5}>Selected Workout</Title>
          {form.values.workoutId && (
            <>
              <Text>
                {
                  props.workouts.find((v) => v.id === form.values.workoutId)
                    ?.name
                }
              </Text>
              <Text>
                {
                  props.workouts.find((v) => v.id === form.values.workoutId)
                    ?.description
                }
              </Text>
              {/* <WorkoutExerciseLinkTable initialWorkoutExercises={} TODO link exercise table, make readonly, then put that into another page for users */}
            </>
          )}
          <Group position="right">
            <Button
              variant="filled"
              onClick={() => {
                close();
                if (props.onEdit) {
                  props.onEdit(form.values);
                } else {
                  form.reset();
                  props.onAdd({
                    key: uuidv4(),
                    userId: form.values.userId,
                    workoutId: form.values.workoutId,
                  });
                }
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
          Add Workout
        </Button>
      )}
    </>
  );
};

export default WorkoutUserAssignmentModal;
