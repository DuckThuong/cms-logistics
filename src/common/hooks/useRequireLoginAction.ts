import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import {
  type LoginRequiredModalOptions,
  useLoginRequiredModal,
} from "../../providers/loginRequiredModalProvider";
import { ROUTER_PATH } from "../../router/Route";

interface RequireLoginActionOptions extends LoginRequiredModalOptions {
  shouldNavigateToSignIn?: boolean;
  signInState?: Record<string, unknown>;
}

const getSafeRedirectPath = (redirectPath: unknown) => {
  if (typeof redirectPath !== "string" || !redirectPath) {
    return undefined;
  }

  if (!redirectPath.startsWith("/") || redirectPath.startsWith("//")) {
    return undefined;
  }

  if (redirectPath === ROUTER_PATH.SIGN_IN) {
    return undefined;
  }

  return redirectPath;
};

export const useRequireLoginAction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openLoginRequiredModal } = useLoginRequiredModal();

  const requireLoginAction = useCallback(
    (action: () => void, options?: RequireLoginActionOptions) => {
      if (isAuthenticated) {
        action();
        return true;
      }

      const currentPathAtOpen = `${location.pathname}${location.search}${location.hash}`;

      openLoginRequiredModal({
        ...options,
        onConfirm: () => {
          const providedRedirectPath = getSafeRedirectPath(
            options?.signInState?.redirectTo,
          );
          const fallbackRedirectPath = getSafeRedirectPath(currentPathAtOpen);
          const mergedSignInState: Record<string, unknown> = {
            ...(options?.signInState ?? {}),
            redirectTo: providedRedirectPath ?? fallbackRedirectPath,
          };

          options?.onConfirm?.();
          if (options?.shouldNavigateToSignIn === false) {
            return;
          }

          navigate(ROUTER_PATH.SIGN_IN, { state: mergedSignInState });
        },
        onCancel: () => {
          options?.onCancel?.();
        },
      });

      return false;
    },
    [isAuthenticated, location.hash, location.pathname, location.search, navigate, openLoginRequiredModal],
  );

  return { requireLoginAction, isAuthenticated };
};
