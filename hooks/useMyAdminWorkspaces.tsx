import { User, Workspace } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useMyAdminWorkspaces(): Workspace[] {
  const [myWorkspaces, setMyWorkspaces] = useState<Workspace[]>();
  const session = useSession();

  useEffect(() => {
    fetch("/api/workspace/admin/me", {
      method: "GET",
    })
      .then((value: Response) => {
        return value.json();
      })
      .then((data) => {
        setMyWorkspaces(data as Workspace[]);
      });

  }, [session]);

  return myWorkspaces;
}
