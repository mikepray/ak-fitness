import { WorkoutExercise } from "@prisma/client";

export type NewWorkoutExercise = Omit<WorkoutExercise, "id" | "workoutId"> & {key: string}
