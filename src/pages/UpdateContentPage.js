import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateContentPage = () => {
  const [empInfo, setEmpInfo] = useState();
  const [address, setAddress] = useState();
  const [loading, setLoading] = useState(false);
  const [intialEmpInfo, setInitialEmpInfo] = useState();
  const [initialAddress, setInitialAddress] = useState();

  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();
  const key = process.env.REACT_APP_API_KEY

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://employee-management-springboot-backend-1.onrender.com/api/v1/fetch-emp/${id}`);
      setLoading(false);
      setEmpInfo(res.data.Employee);

      const fetchedEmployee = res.data.Employee;
      const employee = {
        firstName: fetchedEmployee.firstName,
        lastName: fetchedEmployee.lastName,
        gender: fetchedEmployee.gender,
        salary: fetchedEmployee.salary,
        dob: fetchedEmployee.dob,
        jobTitle: fetchedEmployee.jobTitle,
        empType: fetchedEmployee.empType,
        phoneNo: fetchedEmployee.phoneNo,
        email: fetchedEmployee.email,
        image: fetchedEmployee.image,
        imageName: fetchedEmployee.imageName,
        imageType: fetchedEmployee.imageType
      }

      const fetchedAddress = {
        city: fetchedEmployee.address.city,
        state: fetchedEmployee.address.state,
        country: fetchedEmployee.address.country,
        zip: fetchedEmployee.address.zip
      }

      setEmpInfo(employee);
      setAddress(fetchedAddress);
      setInitialEmpInfo(employee);
      setInitialAddress(fetchedAddress);
    } catch (error) {
      setLoading(false)
      toast.error("Error while fetching employee's information");
    }
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  useEffect(() => {
    fetchCountries();
  }, [address]);

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setEmpInfo(prevEmp => ({
      ...prevEmp,
      [name]: value
    }))
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prevAddr => ({
      ...prevAddr,
      [name]: value
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const employeeData = { ...empInfo, address };

    try {
      const res = await axios.put(`https://employee-management-springboot-backend-1.onrender.com/api/v1/update-emp/${id}`, employeeData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setLoading(false);
      toast.success("Employee updated successfully");
      setTimeout(() => {
        navigate("/");
      }, 3000)
    } catch (error) {
      setLoading(false);
      toast.error("Error while updating employee");
    }
  }

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

  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://api.countrystatecity.in/v1/countries', {
        headers: {
          'X-CSCAPI-KEY': key
        }
      });
      setCountries(response.data);
      setSelectedCountry(countries.find((country) => country.name === address?.country));
    } catch (error) {
      toast.error("Error while fetching countries");
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await axios.get(`https://api.countrystatecity.in/v1/countries/${country.iso2}/states`, {
        headers: {
          'X-CSCAPI-KEY': key
        }
      });
      setStates(response.data);
    } catch (error) {
      toast.error("Error while fetching states");
    }
  };

  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
    } else {
      setStates([]);
    }
  }, [selectedCountry])


  const handleReset = () => {
    setEmpInfo(intialEmpInfo);
    setAddress(initialAddress);
  }
  return (
    <>
      <Header />
      <form className='' onSubmit={handleUpdate} style={{ backgroundColor: "#f7faf8" }}>
        <div className='flex items-center px-3'>
          <BackButton />
          <h1 className='text-center text-3xl mt-3 mb-2 font-bold text-orange-400 m-auto'>Update Employee's Information</h1>
        </div>
        {loading ? <Spinner /> :
          <div className='flex flex-col md:flex-row justify-evenly mt-3'>
            <div className=' w-full p-3'>
              <div className=' flex justify-center relative'>
                <div className='w-40 h-40 overflow-hidden rounded-full'>
                  <img
                    className=' object-cover h-full w-full rounded-full'
                    src={empInfo?.image ? getImageSrc(empInfo?.image) : "/images/user.png"}
                    alt="employee"
                  />
                </div>
              </div>
              <h2 className=' text-2xl mt-2'>Personal Details</h2>
              <div className='flex flex-col sm:flex-row justify-evenly gap-x-4'>
                <div className='flex flex-col mb-2 w-full'>
                  <label htmlFor='firstname'>First Name</label>
                  <input
                    className='border border-gray-400 p-1 rounded-md'
                    type="text"
                    required
                    placeholder='enter first name'
                    id='firstname'
                    name='firstName'
                    value={empInfo?.firstName}
                    onChange={(e) => handleEmployeeInputChange(e)}
                  />
                </div>
                <div className='flex flex-col mb-2 w-full'>
                  <label htmlFor='lastname'>Last Name</label>
                  <input
                    className='border border-gray-400 p-1 rounded-md'
                    type="text"
                    required
                    placeholder='enter last name'
                    id='lastname'
                    name='lastName'
                    value={empInfo?.lastName}
                    onChange={(e) => handleEmployeeInputChange(e)}
                  />
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-evenly gap-x-4'>
                <div className='flex flex-col mb-2 w-full'>
                  <label >Gender</label>
                  <div className='flex justify-evenly items-center'>
                    Male <input
                      className=' w-4 h-4 cursor-pointer'
                      type='radio'
                      name='gender'
                      value="male"
                      checked={empInfo?.gender === "male"}
                      onChange={(e) => handleEmployeeInputChange(e)}
                    />

                    Female <input
                      className=' w-4 h-4 cursor-pointer'
                      type='radio'
                      name='gender'
                      value="female"
                      checked={empInfo?.gender === "female"}
                      onChange={(e) => handleEmployeeInputChange(e)}
                    />
                    Others <input
                      className=' w-4 h-4 cursor-pointer'
                      type='radio'
                      name='gender'
                      value="others"
                      checked={empInfo?.gender === "others"}
                      onChange={(e) => handleEmployeeInputChange(e)}
                    />
                  </div>
                </div>
                <div className='flex flex-col mb-2 w-full'>
                  <label htmlFor='phone'>Phone no</label>
                  <input
                    className='border border-gray-400 p-1 rounded-md'
                    type="tel"
                    required
                    placeholder='enter mobile no'
                    id='phone'
                    name='phoneNo'
                    value={empInfo?.phoneNo}
                    onChange={(e) => handleEmployeeInputChange(e)}
                  />
                </div>
              </div>

              <div className='flex flex-col sm:flex-row justify-evenly gap-x-4'>
                <div className='flex flex-col mb-2 w-full'>
                  <label htmlFor='job'>Job</label>
                  <select
                    className='border border-gray-400 p-1 rounded-md cursor-pointer'
                    required
                    disabled
                    id='job'
                    name='jobTitle'
                    value={empInfo?.jobTitle}
                  >
                    <option value="">--Select job--</option>
                    <option value="Designer">Designer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Front End Developer">Front End Developer</option>
                    <option value="Back End Developer">Back End Developer</option>
                    <option value="Software Tester">Software Tester</option>
                    <option value="Quality Assurance Engineer">Quality Assurance Engineer</option>
                    <option value="Support Engineer">Support Engineer</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div className='flex flex-col mb-2 w-full'>
                  <label htmlFor='emptype'>Employee Type</label>
                  <select
                    className='border border-gray-400 p-1 rounded-md cursor-pointer'
                    required
                    disabled
                    id='emptype'
                    name='empType'
                    value={empInfo?.empType}
                  >
                    <option
                      selected
                      value="full time">Full Time</option>
                    <option value="part time">Part Time</option>
                    <option value="contractor">Contractor</option>
                  </select>
                </div>
              </div>

            </div>
            <div className='w-full px-3'>
              <div className='flex flex-col mb-2'>
                <label htmlFor='email'>Email</label>
                <input
                  className='border border-gray-400 p-1 rounded-md'
                  type="email"
                  required
                  readOnly
                  placeholder='enter email'
                  id='email'
                  name='email'
                  value={empInfo?.email}
                />
              </div>
              <div className='flex flex-col sm:flex-row justify-evenly gap-x-4'>

                {/* DOB */}
                <div className='flex flex-col mb-2 w-full'>
                  <label htmlFor='dob'>DOB</label>
                  <input
                    className='border border-gray-400 p-1 rounded-md'
                    type="date"
                    placeholder='enter dob'
                    id='dob'
                    name='dob'
                    value={empInfo?.dob}
                    onChange={(e) => handleEmployeeInputChange(e)}
                  />
                </div>
                {/* Salary */}
                <div className='flex flex-col mb-2 w-full'>
                  <label htmlFor='salary'>Salary</label>
                  <input
                    className='border border-gray-400 p-1 rounded-md'
                    type="text"
                    placeholder='enter salary'
                    id='salary'
                    name='salary'
                    value={empInfo?.salary}
                    onChange={(e) => handleEmployeeInputChange(e)}
                  />
                </div>
              </div>
              <div className=''>
                <h2 className=' text-2xl'>Address</h2>
                <div className='flex flex-col mb-2 w-full'>
                  <label htmlFor='country'>Country</label>
                  <select
                    className='border border-gray-400 p-1 rounded-md cursor-pointer'
                    required
                    disabled
                    id='country'
                    name='country'
                    value={address?.country}
                  >
                    <option value={address?.country}>{address?.country}</option>
                  </select>
                </div>
                <div className='flex flex-col sm:flex-row justify-evenly gap-x-4'>
                  <div className='flex flex-col mb-2 w-full'>
                    <label htmlFor='state'>State</label>
                    <select
                      className='border border-gray-400 p-1 rounded-md cursor-pointer'
                      required
                      id='state'
                      name='state'
                      value={address?.state}

                      onChange={(e) => handleAddressInputChange(e)}
                    >
                      <option defaultValue={address?.state}>{address?.state}</option>
                      {states.map(state => (
                        <option key={state.name} value={state.name}>{state.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className='flex flex-col mb-2 w-full'>
                    <label htmlFor='city'>City</label>
                    <input
                      className='border border-gray-400 p-1 rounded-md cursor-pointer'
                      required
                      type="text"
                      id='city'
                      name='city'
                      value={address?.city}
                      onChange={(e) => handleAddressInputChange(e)}
                    />
                  </div>
                </div>
                <div className='flex gap-x-4'>
                  <div className='flex flex-col mb-2 w-full'>
                    <label htmlFor='zip'>Zip</label>
                    <input
                      className='border border-gray-400 p-1 rounded-md'
                      type="text"
                      placeholder='enter zip'
                      id='zip'
                      name='zip'
                      value={address?.zip}
                      onChange={(e) => handleAddressInputChange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className='flex justify-center gap-x-4 py-4'>
                <button onClick={handleReset} className=' px-8 py-3 bg-orange-300 rounded-md'>Reset</button>
                <button type='submit' className=' px-8 py-3 bg-green-300 rounded-md'>Update</button>
              </div>
            </div>
          </div>
        }
      </form>
      <ToastContainer />
    </>
  )
}
export default UpdateContentPage
