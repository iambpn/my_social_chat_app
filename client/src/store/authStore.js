import { atom, selector } from "recoil";
import { AxiosInstance } from "../axios/axiosInstance";

export const AuthInfoState = atom({
  key: "auth_authInfoState",
  default: {
    userInfo: {},
    isAuthenticated: false,
  },
  effects: [
    async ({ setSelf, resetSelf }) => {
      try {
        const res = await AxiosInstance.get("api/user");
        setSelf({
          userInfo: res.data.data,
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
