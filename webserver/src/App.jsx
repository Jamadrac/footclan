import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ProtectedRoute from "./ProtectedRoute";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import Home from "./screens/Home";
import Signup from "./screens/register";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          {/* <ProtectedRoute path="/profile" element={<HomeScreen />} /> */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
