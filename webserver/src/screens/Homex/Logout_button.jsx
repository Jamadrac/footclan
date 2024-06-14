// webserver/src/components/LogoutButton.js
import React from "react";
import { useRecoilState } from "recoil";
import { userState, isAuthenticatedState } from "../../recoil/atoms";

const LogoutButton = () => {
  const [, setUser] = useRecoilState(userState);
  const [, setIsAuthenticated] = useRecoilState(isAuthenticatedState);

  const handleLogout = () => {
    setUser({
      id: "",
      username: "",
      firstName: "",
      lastName: "",
      mobile: "",
      address: "",
      profile: "",
      token: "",
    });
    setIsAuthenticated(false);
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
