import Router from "next/router";
import { useEffect } from "react";
import { UserAuthState } from "../shared/types";
import { useUserStore } from "../stores/user.store";

/**
 * @param protectFrom Who to protect the route from, if from unauthenticated user, the hook will cause the page
 * redirect to sign in page, otherwise the hook will cause the page to redirect to home page. Defaults
 * to unauthenticated user if not provided.
 */
export const useRouteProtection = (
  protectFrom: UserAuthState = UserAuthState.UNAUTHENTICATED
) => {
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    if (protectFrom === UserAuthState.UNAUTHENTICATED && userId === null) {
      Router.replace("/auth/sign-in");
    } else if (protectFrom === UserAuthState.AUTHENTICATED && userId !== null) {
      Router.replace("/");
    }
  }, [userId, protectFrom]);
};
