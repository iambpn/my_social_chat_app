import { VscCircleFilled } from "react-icons/vsc";

export default function ConversationOnline() {
  return (
    <>
      <div className='flex flex-col'>
        <div className='flex justify-around w-full items-center pb-2 pt-2'>
          <div className='flex justify-start items-center'>
            <span>
              <img src='https://random.imagecdn.app/100/100' alt='profile image' className='h-[30px] w-[30px] rounded-full mr-4 border border-gray-400' />
            </span>
            <span className='capitalize'>{"api name"}</span>
          </div>
          <span className=''>
            <VscCircleFilled color='green' />
          </span>
        </div>
      </div>
    </>
  );
}
