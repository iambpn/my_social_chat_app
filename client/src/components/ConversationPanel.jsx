import { useRecoilValue } from "recoil";
import { AuthInfoState } from "../store/authStore";

export default function ConversationPanel() {
  return (
    <>
      <div>
        <div>
          <input
            type='text'
            className='form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none border-0  border-solid border-gray-300 border-b-2'
            placeholder='Search for friends'
          />
        </div>
        <div className='flex flex-col'>
          <div className='flex justify-around w-full items-center py-3'>
            <span>
              <img src='https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp' alt='profile image' className='h-[40px] w-[40px] rounded-full' loading='eager' />
            </span>
            <span className='capitalize'>{"api name"}</span>
          </div>
        </div>
      </div>
    </>
  );
}
