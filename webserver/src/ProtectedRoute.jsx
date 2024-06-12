// src/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthenticatedState } from "./recoil/atoms";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
