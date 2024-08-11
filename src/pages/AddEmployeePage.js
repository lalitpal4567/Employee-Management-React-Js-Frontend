import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../components/Header'
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';


const AddEmployeePage = () => {
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [gender, setGender] = useState();
  const [jobTitle, setJobTitle] = useState();
  const [dob, setDob] = useState();
  const [salary, setSalary] = useState();
  const [empType, setEmpType] = useState("Full time");
  const [email, setEmail] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState();
  const [image, setImage] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  const navigate = useNavigate();
  const key = process.env.REACT_APP_API_KEY

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailExists(false);
    const formData = new FormData();


    const employeeData = ('newEmployee', JSON.stringify({
      firstName, lastName, gender, jobTitle, salary, dob, empType, email, phoneNo,
      address: { city, state, country, zip }
    }));
    formData.append('newEmployee', new Blob([employeeData], { type: 'application/json' }));
    formData.append('imageFile', image);

    setLoading(true);
    try {
      const res = await axios.post(`https://employee-management-springboot-backend-1.onrender.com/api/v1/add-emp`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      toast.success("New employee added successfully.")
      setTimeout(() => {
        navigate("/")
      }, 3000)

    } catch (error) {
      setLoading(false);
      if (error.response?.data?.error === "Email already exists.") {
        setEmailExists(true);
        toast.error("Email already exists.")
        return;
      }
      setEmailExists(false);
      toast.error("Error while adding new employee")
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://api.countrystatecity.in/v1/countries', {
        headers: {
          'X-CSCAPI-KEY': key
        }
      });
      setCountries(response.data);
      setState([]);
    } catch (error) {
      toast.error("Error while fetching countries")
    }
  };

  const fetchStates = async (countryIso2) => {
    try {
      const response = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryIso2}/states`, {
        headers: {
          'X-CSCAPI-KEY': key
        }
      });
      setStates(response.data);
    } catch (error) {
      toast.error("Error while fetching states")
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  const handleCountryChange = (event) => {
    const country = JSON.parse(event.target.value);
    setSelectedCountry(country.iso2);
    setCountry(country.name);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const MAX_SIZE = 1024 * 1024 * 10;
    if (file) {
      if (file.size <= MAX_SIZE) {
        setImage(file);
      } else {
        toast.error("File size should not exceed 10Mb");
      }
    }
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setGender("");
    setJobTitle("");
    setDob("");
    setSalary("");
    setEmpType("Full Time");
    setEmail("");
    setPhoneNo("");
    setCity("");
    setState("");
    setCountry("");
    setZip("");
    setImage(null);
  }

  return (
    <>
      <Header />
      <div className='' style={{ backgroundColor: "#f7faf8" }}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='flex items-center px-3'>
            <BackButton />
            <h1 className='text-center text-3xl mt-3 mb-2 font-bold text-orange-400 m-auto'>Add New Employee</h1>
          </div>
          {loading ? <Spinner /> :
            <div className='flex flex-col md:flex-row justify-evenly mt-3'>
              <div className=' w-full p-3'>
                <div className=' flex flex-col justify-center items-center relative'>
                  <div className='w-40 h-40 overflow-hidden rounded-full'>
                    <img
                      className='object-cover w-full h-full '
                      src={image ? URL.createObjectURL(image) : '/images/user.png'}
                      alt="employee"
                    />
                  </div>
                  <input
                    className='cursor-pointer'
                    type='file'
                    accept='image/jpeg, image/png, image/jpg'
                    onChange={handleImageChange}
                  />
                </div>
                <p className=' text-green-500 text-sm text-center'>Image upload might take some time. <span className=' text-red-500'>Size: &lt; 10 Mb</span></p>
                <h2 className=' text-2xl mt-2'>Personal Details</h2>
                <div className='flex flex-col sm:flex-row justify-evenly gap-x-4'>

                  {/* First Name */}
                  <div className='flex flex-col mb-2 w-full'>
                    <label htmlFor='firstname'>First Name
                      <span className=' text-red-500'>*</span>
                    </label>
                    <input
                      className='border border-gray-400 p-1 rounded-md'
                      type="text"
                      required
                      placeholder='enter first name'
                      id='firstname'
                      name='firstName'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  {/* Last Name */}
                  <div className='flex flex-col mb-2 w-full'>
                    <label htmlFor='lastname'>Last Name
                      <span className=' text-red-500'>*</span>
                    </label>
                    <input
                      className='border border-gray-400 p-1 rounded-md'
                      type="text"
                      required
                      placeholder='enter last name'
                      id='lastname'
                      name='lastName'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
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
                        onChange={(e) => setGender(e.target.value)}
                      />

                      Female <input
                        className=' w-4 h-4 cursor-pointer'
                        type='radio'
                        name='gender'
                        value="female"
                        onChange={(e) => setGender(e.target.value)}
                      />
                      Others <input
                        className=' w-4 h-4 cursor-pointer'
                        type='radio'
                        name='gender'
                        value="others"
                        onChange={(e) => setGender(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className='flex flex-col mb-2 w-full'>
                    <label htmlFor='phone'>Phone no
                      <span className=' text-red-500'>*</span>
                    </label>
                    <input
                      className='border border-gray-400 p-1 rounded-md'
                      type="tel"
                      required
                      placeholder='enter mobile no'
                      id='phone'
                      name='phoneNo'
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                    />
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row justify-evenly gap-x-4'>

                  {/* Job */}
                  <div className='flex flex-col mb-2 w-full'>
                    <label htmlFor='job'>Job
                      <span className=' text-red-500'>*</span>
                    </label>
                    <select
                      className='border border-gray-400 p-1 rounded-md cursor-pointer'
                      required
                      id='job'
                      name='jobTitle'
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
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

                  {/* Type */}
                  <div className='flex flex-col mb-2 w-full'>
                    <label htmlFor='emptype'>Employee Type
                      <span className=' text-red-500'>*</span>
                    </label>
                    <select
                      className='border border-gray-400 p-1 rounded-md cursor-pointer'
                      required
                      id='emptype'
                      name='empType'
                      value={empType}
                      onChange={(e) => setEmpType(e.target.value)}
                    >
                      <option value="full time">Full Time</option>
                      <option value="part time">Part Time</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='w-full px-3 '>

                {/* Email */}
                <div className='flex flex-col mb-2'>
                  <label htmlFor='email'>Email
                    <span className=' text-red-500'>*</span>
                  </label>
                  <input
                    className='border border-gray-400 p-1 rounded-md'
                    type="email"
                    required
                    placeholder='enter email'
                    id='email'
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailExists ? <p className=' text-xs text-red-600 font-bold'>Email already exists.</p> : ""}
                </div>

                <div className='flex flex-col sm:flex-row justify-evenly gap-x-4'>

                  {/* DOB */}
                  <div className='flex flex-col mb-2 w-full'>
                    <label htmlFor='salary'>DOB</label>
                    <input
                      className='border border-gray-400 p-1 rounded-md'
                      type="date"
                      placeholder='enter dob'
                      id='dob'
                      name='dob'
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
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
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </div>
                </div>
                <div className=''>
                  <h2 className=' text-2xl'>Address</h2>
                  {/* Country */}
                  <div className='flex flex-col mb-2 w-full'>
                    <label htmlFor='country'>Country
                      <span className=' text-red-500'>*</span>
                    </label>
                    <select
                      className='border border-gray-400 p-1 rounded-md cursor-pointer'
                      required
                      id='country'
                      name='country'
                      value={country.name}
                      onChange={(e) => handleCountryChange(e)}
                    >
                      <option value="">---Select Country---</option>
                      {countries.map(country => (
                        <option key={country.name} value={JSON.stringify(country)}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className='flex flex-col sm:flex-row justify-evenly gap-x-4'>

                    {/* State */}
                    <div className='flex flex-col mb-2 w-full'>
                      <label htmlFor='state'>State
                        <span className=' text-red-500'>*</span>
                      </label>
                      <select
                        className='border border-gray-400 p-1 rounded-md cursor-pointer'
                        required
                        id='state'
                        name='state'
                        value={state?.name}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option value="">---Select State---</option>
                        {states.map((state, index )=> (
                          <option key={index} value={state.name}>{state.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div className='flex flex-col mb-2 w-full'>
                      <label htmlFor='city'>City
                        <span className=' text-red-500'>*</span>
                      </label>
                      <input
                        className='border border-gray-400 p-1 rounded-md cursor-pointer'
                        required
                        type="text"
                        id='city'
                        name='city'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col sm:flex-row justify-evenly gap-x-4'>

                    {/* Zip */}
                    <div className='flex flex-col mb-2 w-full'>
                      <label htmlFor='zip'>Zip</label>
                      <input
                        className='border border-gray-400 p-1 rounded-md'
                        type="text"
                        placeholder='enter zip'
                        id='zip'
                        name='address.zip'
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex justify-center gap-x-4 p-4'>
                  <button className=' px-8 py-3 bg-orange-300 rounded-md' onClick={handleReset}>Reset</button>
                  <button type='submit' className=' px-8 py-3 bg-green-300 rounded-md'>Submit</button>
                </div>
              </div>
            </div>
          }
        </form>
        <ToastContainer />
      </div>
    </>
  )
}

export default AddEmployeePage
