import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AxiosInstance } from "../axios/axiosInstance";
import ErrorText from "../helper/ErrorText";
import { AuthInfoState } from "../store/authStore";
import { MessagesState } from "../store/conversationStore";

export default function ConversationWindow() {
  const messages = useRecoilValue(MessagesState);
  const setMessagesState = useSetRecoilState(MessagesState);
  const authInfo = useRecoilValue(AuthInfoState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      if (messages && messages.conversation_id) {
        await AxiosInstance.post(`/api/message/${messages.conversation_id}`, {
          message: message,
        });

        const res = await AxiosInstance.get(`/api/messages/${messages.conversation_id}`);
        setMessagesState((prev_value) => ({
          ...prev_value,
          messages: res.data.data.reverse(),
        }));
        setMessage("");
      }
    } catch (err) {
      console.log(err.toString());
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <>
      {messages?.conversation_id && (
        <div className='flex-1 flex flex-col'>
          {error && <ErrorText error={error} />}
          <div className='flex-1 overflow-scroll flex flex-col justify-end'>
            {messages.messages.map((message) => {
              return (
                <div className={`flex py-2 flex-col ${authInfo.userInfo._id === message.sender._id ? "items-end" : "items-start"}`} key={message._id}>
                  <span className={`bg-gray-300 px-5 py-1 rounded-md text-sm peer ${authInfo.userInfo._id === message.sender._id ? "rounded-br-none" : "rounded-bl-none"}`}>{message.text}</span>
                  <span className='text-xs lowercase hidden peer-hover:block'>{message.sender.username}</span>
                </div>
              );
            })}
          </div>
          <div className='flex justify-between items-center my-2'>
            <textarea
              className='form-control block basis-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none resize-none mx-3'
              rows='3'
              placeholder='write something...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button
              className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight capitalize rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-3'
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
