import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import ConversationOnline from "../components/ConversationOnline";
import ConversationPanel from "../components/ConversationPanel";
import ConversationWindow from "../components/ConversationWindow";
import Navbar from "../components/Navbar";
import { MessagesState } from "../store/conversationStore";
import { NotificationState } from "../store/notificationStore";

export default function Conversation() {
  const [messageState, setMessageState] = useRecoilState(MessagesState);
  const setNotificationState = useSetRecoilState(NotificationState);
  useEffect(() => {
    const source = new EventSource(`${import.meta.env.VITE_API_URL}/api/notify/messages`, {
      withCredentials: import.meta.env.DEV,
    });

    source.addEventListener(
      "statusCheck",
      (event) => {
        console.log(JSON.parse(event.data));
      },
      false
    );

    source.addEventListener(
      "newMessage",
      (event) => {
        const data = JSON.parse(event.data);
        if (messageState.conversation_id) {
          setMessageState((value) => ({
            ...value,
            messages: [...value.messages, data.message],
          }));
        } else {
          setNotificationState((value) => ({ messages: [...value.messages, { conversation_id: data.message.conversationId._id, content: data.message.text }] }));
        }
      },
      false
    );

    source.addEventListener(
      "close",
      (event) => {
        source.close();
        console.log("Source Closed.");
      },
      false
    );

    source.addEventListener(
      "error",
      (event) => {
        console.log("Error:", event);
        source.close();
        console.log("Source Closed due to Error.");
      },
      false
    );

    return () => {
      source.close();
    };
  });
  return (
    <>
      <Navbar />
      <div className='flex h-[calc(100%-40px)]'>
        <div className='basis-[20%] px-5 border-r-2 border-gray-300 border-solid'>
          <ConversationPanel />
        </div>
        <div className='basis-[60%] px-5 flex'>
          <ConversationWindow />
        </div>
        <div className='basis-[20%] border-l-2 border-gray-300 border-solid'>
          <ConversationOnline />
        </div>
      </div>
    </>
  );
}
