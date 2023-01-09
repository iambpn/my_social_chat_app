import { atom } from "recoil";
import { AxiosInstance } from "../axios/axiosInstance";

export const ConversationsState = atom({
  key: "conversation_conversationState",
  default: [],
  effects: [
    async ({ setSelf, resetSelf }) => {
      try {
        const res = await AxiosInstance.get("api/conversations");
        setSelf(res.data.data);
      } catch (error) {
        //display error
        // console.error(error);
        resetSelf();
      }
    },
  ],
});

export const MessagesState = atom({
  key: "conversation_messagesState",
  default: {
    conversation_id: "",
    messages: [],
  },
});
