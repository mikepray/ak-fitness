import {
  Button,
  Checkbox,
  Group,
  Loader,
  Paper,
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

const CreatePost: React.FC = () => {
  const { data: session, status } = useSession({ required: true });
  const me = useGetEffect<User>("/api/user/me", [session]);
  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      immediatelyPublish: false,
    },
    validate: {
      title: (value) => (value.length > 0 ? null : "Title is required"),
      content: (value) =>
        value.length > 0 ? null : "Post content is required",
    },
  });

  const submitData = async (formData: {
    title: string;
    content: string;
    immediatelyPublish: boolean;
  }) => {
    try {
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          published: formData.immediatelyPublish,
        }),
      });
      await Router.push("/");
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
        <Title order={2}>Create Post</Title>
        <Paper p="md">
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Title"
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Content"
            placeholder="Content"
            withAsterisk
            minRows={10}
            {...form.getInputProps("content")}
          />
          <Group mt="md">
            <Checkbox
              label="Immediately Publish?"
              {...form.getInputProps("immediatelyPublish")}
            />
          </Group>
          <Group position="right" mt="md">
            <Button type="submit">Create</Button>
          </Group>
        </Paper>
      </form>
    </>
  );
};

export default CreatePost;
