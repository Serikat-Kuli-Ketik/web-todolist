import Router from "next/router";
import { useEffect } from "react";
import { useUserStore } from "../stores/user.store";

export const useRouteProtection = () => {
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    if (userId === null) Router.replace("/auth/sign-in");
  }, [userId]);
};
