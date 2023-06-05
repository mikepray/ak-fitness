import { Button, Card, Group, Stack, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useGetEffect } from "../hooks/useGetEffect";

type Props = {
  user: User;
};
export const UserEdit: React.FC<Props> = (props) => {
  const { data: session } = useSession({ required: true });
  const me = useGetEffect<User>("/api/user/me", [session]);
  
  const userForm = useForm({
    initialValues: {
      id: props.user.id,
      name: props.user.name,
      email: props.user.email,
      isUserEnabled: props.user.isUserEnabled,
      isGlobalAdmin: props.user.isGlobalAdmin,
    },
    validate: {
      name: (value: String) =>
        value.length > 0 ? null : "User name is required",
      isGlobalAdmin: (value: boolean) => 
        props.user.id === me.id && !value ? "You cannot demote yourself" : null
    },
  });

  const submitUserForm = async (formData: {
    name: string;
    isUserEnabled: boolean;
    isGlobalAdmin: boolean;
  }) => {
    try {
      const response = await fetch(`/api/user/${props.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          isUserEnabled: formData.isUserEnabled,
          isGlobalAdmin: formData.isGlobalAdmin,
        }),
      });

      if (response.status === 200) {
        notifications.show({
          message: `User ${props.user.name} successfully updated`,
        });
      } else {
        notifications.show({
          message: `${response.status} ${response.statusText}`,
          color: "red",
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        message: "There was a problem taking the action",
      });
    }
  };
  return (
    <Card mb={20}>
      <form onSubmit={userForm.onSubmit((values) => submitUserForm(values))}>
        <Stack>
          <TextInput
            withAsterisk
            label="User Name"
            placeholder="User Name"
            {...userForm.getInputProps("name")}
          />
          <TextInput
            withAsterisk
            label="User Email"
            disabled
            {...userForm.getInputProps("email")}
          />
          <Switch
            label="User is enabled?"
            onLabel="Yes"
            offLabel="No"
            labelPosition="left"
            {...userForm.getInputProps("isUserEnabled", {
              type: "checkbox",
            })}
          />
           <Switch
            label="User is Global Admin?"
            onLabel="Yes"
            offLabel="No"
            labelPosition="left"
            {...userForm.getInputProps("isGlobalAdmin", {
              type: "checkbox",
            })}
          />
          <Group position="right" mt="md">
            <Button type="submit">Update</Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
