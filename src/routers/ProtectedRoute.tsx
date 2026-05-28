import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../common/contexts/authContext";
import { useLoading } from "../providers/loadingProvider";
import { ROUTER_PATH } from "./Route";

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const { setLoading } = useLoading();
  const { isAuthenticated, user, checkAuthStatus, isLoading, isAuthResolved } =
    useAuth();
  const currentPath = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    if (!isAuthResolved && !isLoading) {
      void checkAuthStatus();
    }
  }, [isAuthResolved, isLoading, checkAuthStatus]);

  useEffect(() => {
    setLoading(isLoading || !isAuthResolved);
  }, [isLoading, isAuthResolved, setLoading]);

  if (isLoading || !isAuthResolved) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTER_PATH.SIGN_IN}
        replace
        state={{ from: currentPath }}
      />
    );
  }

  if (!user) {
    return (
      <Navigate
        to={ROUTER_PATH.SIGN_IN}
        replace
        state={{ from: currentPath }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
