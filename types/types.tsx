import { User, Workout, WorkoutExercise, WorkoutUser } from "@prisma/client";

export type NewWorkoutExercise = Omit<WorkoutExercise, "id" | "workoutId"> & {
  key: string;
};

export type NewWorkoutUser = Omit<WorkoutUser, "id"> & { key: string };

export type WorkoutIncludingWorkoutExercises = Workout & {
  workoutExercises: WorkoutExercise[];
};

export type UserIncludingWorkoutUsers = User & {
  workoutUsers: NewWorkoutUser[];
};
