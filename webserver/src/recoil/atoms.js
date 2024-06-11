import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    profile: "",
    token: "",
  },
});

export const isAuthenticatedState = atom({
  key: "isAuthenticatedState",
  default: false,
});
