import { VscCircleFilled } from "react-icons/vsc";
import { IoMdPersonAdd } from "react-icons/io";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ConversationsState, FriendsState } from "../store/conversationStore";
import ErrorText from "../helper/ErrorText";
import { AuthInfoState } from "../store/authStore";
import { AxiosInstance } from "../axios/axiosInstance";

export default function ConversationOnline() {
  const friendsState = useRecoilValue(FriendsState);
  const authInfoState = useRecoilValue(AuthInfoState);
  const setConversationState = useSetRecoilState(ConversationsState);

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const checkBoxHandler = (e, user_id) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setUsers((val) => [...val, user_id]);
    } else {
      setUsers((val) => val.filter((x) => x !== user_id));
    }
  };

  const handleCreateConversation = async (e) => {
    try {
      await AxiosInstance.post(`/api/conversation`, {
        users: [...users, authInfoState.userInfo._id],
      });

      const res = await AxiosInstance.get("api/conversations");
      setConversationState(res.data.data);
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
    <div className='px-4'>
      {error && <ErrorText error={error} />}
      <div className='flex mt-2'>
        <input
          type='text'
          className='form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none border-0  border-solid border-gray-300 border-b-2'
          placeholder='Search friends'
        />
        <button className='border border-gray-300 rounded p-2 ml-5' title='New Conversation' onClick={handleCreateConversation}>
          <IoMdPersonAdd />
        </button>
      </div>
      <div className='flex flex-col'>
        {friendsState.map((user) => {
          return (
            <div className='flex justify-start w-full items-center pb-2 pt-2' key={user._id}>
              <div className='flex justify-start items-center'>
                <span>
                  <input type='checkbox' className='mr-4' onChange={(e) => checkBoxHandler(e, user._id)} checked={users.includes(user._id)} />
                </span>
                <span>
                  <img src='https://random.imagecdn.app/100/100' alt='profile image' className='h-[30px] w-[30px] rounded-full mr-4 border border-gray-400' />
                </span>
                <span className='capitalize'>{user.username}</span>
              </div>
              {/* <span className=''>
            <VscCircleFilled color='green' />
          </span> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
