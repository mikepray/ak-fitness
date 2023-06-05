import {
  Button,
  Checkbox,
  Group,
  Loader,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import Router from "next/router";
import React from "react";
import { useGetEffect } from "../hooks/useGetEffect";
import { User } from "@prisma/client";
import { AuthAdminRequired } from "../components/AuthAdminRequired";
import { notifications } from "@mantine/notifications";

const CreateExercise: React.FC = () => {
  const { data: session, status } = useSession({ required: true });
  const me = useGetEffect<User>("/api/user/me", [session]);
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      tags: "",
      type: "",
      equipmentRequired: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
    },
  });

  const submitData = async (formData: {
    name: string;
    description: string;
    tags: string;
    type: string;
    equipmentRequired: string;
  }) => {
    try {
      const response = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          tags: formData.tags,
          type: formData.type,
          equipmentRequired: formData.equipmentRequired,
        }),
      });
      if (response.status === 200) {
        notifications.show({
          message: `Exercise created`,
        });
      } else {
        notifications.show({
          message: `${response.status} ${response.statusText}`,
          color: "red",
        });
      }
      await Router.push("/exercises");
    } catch (error) {
      console.error(error);
    }
  };

  if (status === "loading" || !session || !me) {
    return <Loader />;
  }

  if (!me.isGlobalAdmin) {
    return <AuthAdminRequired />;
  }

  return (
    <>
      <form onSubmit={form.onSubmit((values) => submitData(values))}>
        <Title order={2}>New Exercise</Title>
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
        <TextInput
          label="Type"
          placeholder="Type (e.g., cardio, anerobic, etc)"
          {...form.getInputProps("type")}
        />
        <TextInput
          label="Equipment Required"
          placeholder="Equipment Required"
          {...form.getInputProps("equipmentRequired")}
        />
        <Group position="right" mt="md">
          <Button type="submit">Create</Button>
        </Group>
      </form>
    </>
  );
};

export default CreateExercise;
