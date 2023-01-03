import { VscCircleFilled } from "react-icons/vsc";

export default function ConversationOnline() {
  return (
    <>
      <div className='flex flex-col'>
        <div className='flex justify-around w-full items-center pb-2 pt-2'>
          <div className='flex justify-start items-center'>
            <span>
              <img src='https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp' alt='profile image' className='h-[30px] w-[30px] rounded-full mr-4' loading='eager' />
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
