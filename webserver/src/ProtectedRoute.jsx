import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthenticatedState } from "./recoil/atoms";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);

  const routeElement = isAuthenticated ? (
    <Component />
  ) : (
    <Navigate to="/login" replace />
  );

  return <Route {...rest} element={routeElement} />;
};

export default ProtectedRoute;
