import { useEffect } from "react";
import ConversationOnline from "../components/ConversationOnline";
import ConversationPanel from "../components/ConversationPanel";
import ConversationWindow from "../components/ConversationWindow";
import Navbar from "../components/Navbar";

export default function Conversation() {
  useEffect(() => {
    const event = new EventSource(`${import.meta.env.VITE_API_URL}/api/notify/messages`, {
      withCredentials: true,
    });

    event.addEventListener("statusCheck", (event) => {
      // event named `eventData` will be received here
      console.log("initialMessage:", event);
    });

    event.addEventListener("newMessage", (event) => {
      // event named `eventData` will be received here
      console.log("neMessage:", event);
    });

    event.addEventListener("error", (error) => {
      console.log("Error:", error);
      console.log("SSE closed due to error.");
      event.close();
    });

    return () => {
      event.close();
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
