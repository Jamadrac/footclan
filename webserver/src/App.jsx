import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ProtectedRoute from "./ProtectedRoute";
import LoginScreen from "./screens/LoginScreen";
import Profile from "./screens/Profile";
import MapScreen from "./screens/Map";
import Home from "./screens/Home";
import Signup from "./screens/register";

const router = createBrowserRouter([
  { path: "/login", element: <LoginScreen /> },
  { path: "/register", element: <Signup /> },
  { path: "/", element: <Home /> },
  {
    path: "/profile",
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: "/map",
    element: <ProtectedRoute element={<MapScreen />} />,
  },
]);

function App() {
  return (
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  );
}

export default App;
