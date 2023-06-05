import { Flex, Button } from "@mantine/core";
import { PostProps } from "./Post";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { notifications } from "@mantine/notifications";

async function publishPost(id: string, routeAfterAction: string): Promise<void> {
    const response = await fetch(`/api/publish/${id}`, {
      method: "PUT",
    });
    if (response.status === 200) {
      notifications.show({
        message: `Post published`,
      });
    } else {
      notifications.show({
        message: `${response.status} ${response.statusText}`,
        color: "red",
      });
    }
    await Router.push(routeAfterAction);
  }
  
  async function unpublishPost(id: string, routeAfterAction: string): Promise<void> {
    const response = await fetch(`/api/unpublish/${id}`, {
      method: "PUT",
    });
    if (response.status === 200) {
      notifications.show({
        message: `Post unpublished`,
      });
    } else {
      notifications.show({
        message: `${response.status} ${response.statusText}`,
        color: "red",
      });
    }
    await Router.push(routeAfterAction);
  }
  
  async function deletePost(id: string, routeAfterAction: string): Promise<void> {
    const response = await fetch(`/api/post/${id}`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      notifications.show({
        message: `Post deleted`,
      });
    } else {
      notifications.show({
        message: `${response.status} ${response.statusText}`,
        color: "red",
      });
    }
    Router.push(routeAfterAction);
  }

export const AdminPostActions: React.FC<{ id: string, published: boolean, routeAfterAction: {onPublish: string, onUnpublish: string, onDelete: string} }> = ({ id, published, routeAfterAction }) => {
    const { data: session, status } = useSession();

    return (
        <Flex gap="sm" justify="flex-end" align="flex-center">
          {session && published && (
            <Button 
            variant="default" 
            compact
            onClick={() => unpublishPost(id, routeAfterAction.onUnpublish)}
            >
              Unpublish
            </Button>
          )}
          {session && !published && (
            <Button variant="default  " compact
            onClick={() => publishPost(id, routeAfterAction.onPublish)}
            >
              Publish
            </Button>
          )}
          {session && (
            <Button variant="light" compact color="red"
            onClick={() => deletePost(id, routeAfterAction.onDelete)}>
              Delete
            </Button>
          )} 
        </Flex>
    );
}