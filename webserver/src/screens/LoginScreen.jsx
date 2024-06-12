import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userState, isAuthenticatedState } from "../recoil/atoms";
import config from "../../config";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useSetRecoilState(userState);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.baseURL}/api/login`, {
        username,
        password,
      });

      const data = response.data;
      if (response.status === 200) {
        setUser({
          id: data.id,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          mobile: data.mobile,
          address: data.address,
          profile: data.profile,
          token: data.token,
        });
        setIsAuthenticated(true);
        navigate("/profile");
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col items-center justify-center h-screen"
    >
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </form>
  );
};

export default LoginScreen;
