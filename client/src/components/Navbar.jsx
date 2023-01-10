import { AuthInfoState } from "../store/authStore";
import { AiFillMessage } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import { AxiosInstance } from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { NotificationState } from "../store/notificationStore";

export default function Navbar() {
  const authInfo = useRecoilValue(AuthInfoState);
  const notificationState = useRecoilValue(NotificationState);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await AxiosInstance.get("/api/auth/logout");
    navigate("/login");
  };

  return (
    <>
      <nav className={"flex justify-between bg-blue-500 h-9 items-center"}>
        <div className='basis-[20%] flex justify-around'>
          <p className='font-bold text-md text-white'>My Social</p>
        </div>
        <div className='basis-[60%] flex justify-center'>
          <input
            type='text'
            className='form-control block w-1/2 px-4 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            placeholder='search for friends'
          />
        </div>
        <div className='basis-[10%] flex justify-around'>
          <div className='relative w-fit'>
            <span data-count={notificationState.messages.length} id='batch-icon' className='cursor-pointer'>
              <AiFillMessage color='white' />
            </span>
          </div>
        </div>
        <div className='basis-[10%] flex justify-around'>
          <div className='group relative text-sm cursor-pointer w-full mx-3'>
            <span className='capitalize text-lg text-white'>{authInfo?.userInfo?.username}</span>
            <ul className='hidden group-hover:block absolute group-focus:block bg-white w-full px-2 border-blue-500 border hover:bg-blue-200 pb-1'>
              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
