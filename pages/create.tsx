import {
  Box,
  Button,
  Checkbox,
  Group,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Router from "next/router";
import React from "react";

const Draft: React.FC = () => {
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
      if (formData.immediatelyPublish) {
        await Router.push("/");
      } else {
        await Router.push("/drafts");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit((values) => submitData(values))}>
        <Title order={2}>New Post</Title>
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
      </form>
    </>
  );
};

export default Draft;
