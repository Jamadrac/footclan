// webserver\src\recoil\atoms.js
import { atom } from "recoil";

function localStorageEffect(key) {
  return ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
}

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
  effects_UNSTABLE: [localStorageEffect("userState")],
});

export const isAuthenticatedState = atom({
  key: "isAuthenticatedState",
  default: false,
  effects_UNSTABLE: [localStorageEffect("isAuthenticatedState")],
});
