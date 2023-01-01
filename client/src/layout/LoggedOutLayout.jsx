export default function LoggedOutLayout({ children }) {
  return (
    <div className='bg-gray-200 h-screen'>
      <div className={"sm:container mx-auto flex justify-center h-full items-center"}>
        <div className='w-[75%]'>
          <div className='flex w-100 items-center'>
            <div className='w-1/2'>
              <h1 className='font-bold leading-tight text-5xl mt-0 mb-2 text-blue-600'>Chat App</h1>
              <h5 className='font-normal leading-tight text-xl mt-0 mb-2'>Chat with your friend in real time</h5>
            </div>
            <div className='w-1/2'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
