import React from 'react'

const ErrorPage = () => {
  return (
    <div>
      <div className='flex flex-col gap-y-6 p-4  items-center h-screen'>
        <img 
          className=' w-[250px] h-[250px]'
          src="./images/sad.png" 
          alt="sad emoji showing wrong url"/>
        <p className=' text-[70px]'>Error: 404</p>
      </div>
    </div>
  )
}

export default ErrorPage
