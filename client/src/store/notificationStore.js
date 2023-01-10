import { atom } from "recoil";

export const NotificationState = atom({
  key: "notification_notificationState",
  default: {
    messages: [],
  },
});

export const notificationSeen = (setter, conversation_id) => {
  setter((value) => {
    const messages = value.messages
      .map((message) => {
        if (message.conversation_id === conversation_id) {
          return undefined;
        }
        return message;
      })
      .filter((x) => x);
    return {
      messages,
    };
  });
};
