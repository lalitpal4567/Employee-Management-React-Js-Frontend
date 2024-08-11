import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { MdModeEdit } from "react-icons/md";
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { FaCopy } from "react-icons/fa";


const InformationPage = () => {
  const [empInfo, setEmpInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchMoreEmpInfo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://employee-management-springboot-backend-1.onrender.com/api/v1/fetch-emp/${id}`);
      setLoading(false);
      setEmpInfo(res.data.Employee);
    } catch (error) {
      toast.error("Error while fetching employee information");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMoreEmpInfo();
  }, []);

  const handleDeleteEmployee = async () => {
    setShowModal(false);
    if (!selectedEmployeeId) return;
    try {
      setLoading(true);
      const res = axios.delete(`https://employee-management-springboot-backend-1.onrender.com/api/v1/remove-emp/${id}`);
      setLoading(false);
      toast.success("Employee removed successfully");
      setInterval(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error("Error while removing employee");
    }
  }

  const printOut = () => {
    window.print();
  }

  const copyTextToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } else if (type === 'phone') {
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 2000);
    }
  };

  const isBase64 = (str) => {
    return str && str.startsWith("/9j/");
  };

  const getImageSrc = (image) => {
    if (image instanceof Blob || image instanceof File) {
      return URL.createObjectURL(image);
    } else if (isBase64(image)) {
      return `data:image/jpeg;base64,${image}`;
    }
    return image;
  };

  const submitProfilePicture = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('imageFile', file);
    try {
      const res = axios.put(`https://employee-management-springboot-backend-1.onrender.com/api/v1/emp/profile-picture/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      setLoading(false);
      setEmpInfo((prevEmpInfo) => ({
        ...prevEmpInfo,
        image: res.data?.Employee?.image
      }));
      toast.success("Profile picture updated successfully");
      setTimeout(() => {
        navigate(`/`)
      }, 3000);
    } catch (error) {
      setLoading(false);
      toast.error("Error while updating profile picture");
    }
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const MAX_SIZE = 1024 * 1024 * 10;
    if (file) {
      if (file.size <= MAX_SIZE) {
        setImageFile(file);
        submitProfilePicture(file);
      } else {
        toast.error("File size should not exceed 10Mb");
      }
    }
  };

  const openDeleteModal = (empId) => {
    setShowModal(true);
    setSelectedEmployeeId(empId);
  }

  const closeDeleteModal = () => {
    setShowModal(false);
    setSelectedEmployeeId(null);
  }

  return (
    <div className=''>
      <DeleteConfirmationModal
        onConfirm={handleDeleteEmployee}
        onCancel={closeDeleteModal}
        show={showModal} />
      <Header />
      <div className='flex  pl-3 items-center'>
        <BackButton />
        <h1 className='text-center text-3xl mt-3 mb-2 font-bold text-orange-400 m-auto'>Employee Information</h1>
      </div>
      {loading ? <Spinner /> :
        <div className='flex justify-center flex-wrap gap-x-20 items-center  p-4 bg-gray-100 m-auto rounded-lg'>
          <div className=' relative'>
            <div className=' w-52 h-52 rounded-full overflow-hidden m-auto'>
              <img
                className=' object-cover h-full w-full'
                src={empInfo.image ? getImageSrc(empInfo.image) : "/images/user.png"}
                alt="employee"
              />
            </div>
            <p className=' text-green-500 text-sm text-center'>Image upload might take some time. <span className=' text-red-500'>Size: &lt; 10 Mb</span></p>

            <div className=''>
              <input
                id='file-upload'
                className='hidden'
                type='file'
                name='image'
                accept='image/jpeg, image/png, image/jpg'
                onChange={handleFileChange}
              />
              <label
                htmlFor='file-upload'
                className='cursor-pointer bg-blue-500 text-white p-1  rounded-full absolute top-5 right-14'
              >
                <MdModeEdit className='' style={{ height: "30px", width: "30px" }} />
              </label>
            </div>
          </div>

          <div>
            <table className='border-separate border-spacing-x-4 mt-3'>
              <tbody>
                <tr className=''>
                  <th className=' text-start'>First Name</th>
                  <td className=''>{empInfo.firstName}</td>
                </tr>
                <tr>
                  <th className=' text-start'>Last Name</th>
                  <td className=''>{empInfo.lastName}</td>
                </tr>
                <tr>
                  <th className=' text-start'>Gender</th>
                  <td className=''>{empInfo.gender}</td>
                </tr>
                <tr>
                  <th className=' text-start'>Job</th>
                  <td className=''>{empInfo.jobTitle}</td>
                </tr>
                <tr>
                  <th className=' text-start'>Dob</th>
                  <td className=''>{empInfo.dob || "-"}</td>
                </tr>
                <tr>
                  <th className=' text-start'>Salary</th>
                  <td className=''>{empInfo.salary || "-"}</td>
                </tr>
                <tr>
                  <th className=' text-start'>Type</th>
                  <td className=''>{empInfo.empType}</td>
                </tr>
                <tr className=''>
                  <th className=' text-start'>Email</th>
                  <td className=''>{empInfo.email}</td>
                  <td className=''><FaCopy className=' size-5 text-blue-500 cursor-pointer' onClick={(e) => copyTextToClipboard(empInfo.email, "email")} /></td>
                </tr>
                <tr>
                  <th className=' text-start'>Phone No.</th>
                  <td className=''>{empInfo.phoneNo}</td>
                  <td><FaCopy className=' size-5 text-blue-500 cursor-pointer' onClick={() => copyTextToClipboard(empInfo.phoneNo, "phone")} /></td>
                </tr>
                <tr>
                  <th className=' text-start'>City</th>
                  <td className=''>{empInfo.address?.city}</td>
                </tr>
                <tr>
                  <th className=' text-start'>State</th>
                  <td className=''>{empInfo.address?.state}</td>
                </tr>
                <tr>
                  <th className=' text-start'>Country</th>
                  <td className=''>{empInfo.address?.country}</td>
                </tr>
                <tr>
                  <th className=' text-start'>Zip</th>
                  <td className=''>{empInfo.address?.zip || "-"}</td>
                </tr>
              </tbody>
            </table>
            <h1 className={`bg-green-300 p-3 mt-2 text-center font-bold ${emailCopied ? "visible" : "hidden"}`}>Email Copied</h1>
            <h1 className={`bg-green-300 p-3 mt-2 text-center font-bold ${phoneCopied ? "visible" : "hidden"}`}>Mobile no. Copied</h1>
          </div>
        </div>
      }
      <div className='flex justify-evenly flex-wrap gap-x-1 p-2 m-auto' style={{ maxWidth: "300px" }}>
        <button onClick={openDeleteModal} className='bg-red-400 py-2 px-3 rounded-md '>Delete</button>
        <button onClick={printOut} className=' bg-sky-400 py-2 px-3 rounded-md '>Print</button>
        <Link to={`/updateEmployeeInfo/${id}`}>
          <button className=' bg-orange-400 py-2 px-3 rounded-md '>Update</button>
        </Link>
      </div>
      <ToastContainer />

    </div>
  )
}
export default InformationPage