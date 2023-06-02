import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useGetMe(): User {
  const [me, setMe] = useState<User>();
  const session = useSession();

  useEffect(() => {
    fetch("/api/user/me", {
      method: "GET",
    })
      .then((value: Response) => {
        return value.json();
      })
      .then((data) => {
        setMe(data as User);
      });
  }, [session]);

  return me;
}
