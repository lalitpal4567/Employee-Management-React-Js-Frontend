import React from 'react'
import { MdCancel } from "react-icons/md";

const AboutAppPage = ({ setShowAppInfo, showAppInfo }) => {
    return (
        <div className={` h-screen flex justify-center items-center bg-black bg-opacity-50 fixed inset-0 z-50 ${showAppInfo ? "visible" : "hidden"}`}>
            <div className=' w-full p-1 px-3 rounded-2xl' style={{ maxWidth: "420px", height: "", backgroundColor: "#FFFDCB" }}>
                <h1 className=' text-3xl text-center'>Employee Management</h1>
                <p className=' mt-2 mb-2 p-2 rounded-md font-semibold' style={{ backgroundColor: "#FEC7B4" }}>This employee management app makes it simple to organize employee details, including personal information, addresses, and profile pictures. It helps keep everything efficient and easy to manage.</p>
                <div className=' p-1 rounded-md relative' style={{ backgroundColor: "#A0E9FF" }}>
                    <strong>Features</strong>
                    <ul>
                        <li><strong>Add Employee Details:</strong> Easily input personal details and addresses for each employee.</li>
                        <li><strong>Upload Profile Picture:</strong> Add a profile picture for each employee to personalize their records.</li>
                        <li><strong>View Employee Information:</strong> Access and view the complete information of any employee.</li>
                        <li><strong>Update Information:</strong> Modify existing employee details as needed to keep records updated.</li>
                        <li><strong>Delete Employee Information:</strong> Remove an employee's information when it's no longer needed.</li>
                    </ul>
                    <MdCancel className=' absolute -top-40 right-0 text-4xl cursor-pointer' onClick={() => setShowAppInfo(false)} />
                </div>
                <p className=' rounded-md p-2 mt-2' style={{ backgroundColor: "#45FFCA" }}><strong>Technology used: </strong>React Js + Spring Boot + MySQL database + Tailwind CSS</p>
                <p className=' mt-2'><i className=' float-end'>Developed By: <strong>Lalit Pal</strong></i></p>
            </div>
        </div>
    )
}

export default AboutAppPage
