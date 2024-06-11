import React from "react";
import { useRecoilValue } from "recoil";
import { userState, isAuthenticatedState } from "../recoil/atoms";

const HomeScreen = () => {
  const user = useRecoilValue(userState);
  const isAuthenticated = useRecoilValue(isAuthenticatedState);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        Please login to see your profile.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">
        Welcome, {user.firstName} {user.lastName}
      </h1>
      <div className="text-lg">Username: {user.username}</div>
      <div className="text-lg">Email: {user.email}</div>
      <div className="text-lg">Mobile: {user.mobile}</div>
      <div className="text-lg">Address: {user.address}</div>
      <div className="text-lg">Profile: {user.profile}</div>
    </div>
  );
};

export default HomeScreen;
