import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ProtectedRoute from "./ProtectedRoute";
import LoginScreen from "./screens/LoginScreen";
import Profile from "./screens/Profile";
import MapScreen from "./screens/Map.jsx";
import Home from "./screens/Home";
import Signup from "./screens/register";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path="/map"
            element={<ProtectedRoute element={<MapScreen />} />}
          />
          {/* <Route
            path="/profile"
            element={<ProtectedRoute element={<HomeScreen />} />}
          /> */}
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
