import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AxiosInstance } from "../axios/axiosInstance";
import ErrorText from "../helper/ErrorText";
import { ConversationsState, MessagesState } from "../store/conversationStore";
import { notificationSeen, NotificationState } from "../store/notificationStore";

export default function ConversationPanel() {
  const conversations = useRecoilValue(ConversationsState);
  const setMessagesState = useSetRecoilState(MessagesState);
  const setNotificationState = useSetRecoilState(NotificationState);
  const [error, setError] = useState("");

  const handleOpenConversation = async (e, conversation_id) => {
    try {
      const res = await AxiosInstance.get(`/api/messages/${conversation_id}`);
      setMessagesState({
        conversation_id: conversation_id,
        messages: res.data.data.reverse(),
      });
      notificationSeen(setNotificationState, conversation_id);
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
      <div>
        {error && <ErrorText error={error} />}
        <div className='flex mt-2'>
          <input
            type='text'
            className='form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none border-0  border-solid border-gray-300 border-b-2'
            placeholder='Search for conversation'
          />
        </div>
        <div className='flex flex-col'>
          {conversations.map((conversation) => (
            <div className='flex justify-around w-full items-center py-3 hover:bg-gray-300' key={conversation._id} onClick={(e) => handleOpenConversation(e, conversation._id)}>
              <span>
                <img src='https://random.imagecdn.app/100/100' alt='profile image' className='h-[40px] w-[40px] rounded-full border border-gray-400' />
              </span>
              <span className='capitalize'>{conversation.members.map((member) => member.username).join(", ")}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
