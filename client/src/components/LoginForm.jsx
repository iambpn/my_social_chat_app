import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { AxiosInstance } from "../axios/axios";
import { AuthInfoState } from "../store/authStore";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setAuthInfo = useSetRecoilState(AuthInfoState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AxiosInstance.post("/login", {
        email,
        password,
      });
      setAuthInfo({
        isAuthenticated: true,
        userInfo: res.data,
      });
    } catch (err) {
      console.log(err.toString());
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
    }
  };

  const errorHtml = <p className='text-red-600 text-center text-sm'>{error}</p>;

  return (
    <>
      <div className='bg-white px-4 py-5 w-[75%] rounded'>
        {error && errorHtml}
        <form className='border-b border-gray-400 py-3' onSubmit={handleSubmit}>
          <input
            type='email'
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none mt-3'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type='password'
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none mt-3'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input
            type='submit'
            value='Log In'
            className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full mt-3 mb-2'
          />
        </form>
        <div className='flex justify-center py-3'>
          <Link
            to={"/register"}
            className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mt-3'
          >
            Create a New Account
          </Link>
        </div>
      </div>
    </>
  );
}
