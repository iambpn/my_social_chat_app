import { atom, selector } from "recoil";
import { AxiosInstance } from "../axios/axios";

export const AuthInfoState = atom({
  key: "auth_authInfoState",
  default: {
    userInfo: {},
    isAuthenticated: false,
  },
  effects: [
    async ({ setSelf, resetSelf }) => {
      try {
        const res = await AxiosInstance.get("/user-info");
        setSelf({
          userInfo: res.data.userInfo,
          isAuthenticated: true,
        });
      } catch (error) {
        //display error
        // console.error(error);
        resetSelf();
      }
    },
  ],
});
