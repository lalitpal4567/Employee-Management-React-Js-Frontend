import React, { useState } from 'react'
import { FaUserEdit } from "react-icons/fa";
import AboutAppPage from './AboutAppPage';


const Header = () => {
  const [showAboutApp, setShowAboutApp] = useState(false);
  
  return (
    <>
      <div className=' bg-sky-400 flex justify-center gap-x-4 px-2 items-center' >
        <FaUserEdit className=' text-amber-400 cursor-pointer' style={{ fontSize: "75px" }} onClick={() => setShowAboutApp(true)} />
        <p className=' text-3xl' style={{ fontWeight: "bold" }} >Employee Management</p>
      </div>
      <AboutAppPage
        setShowAppInfo={setShowAboutApp}
        showAppInfo={showAboutApp}
      />
    </>
  )
}

export default Header
