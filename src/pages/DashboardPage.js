import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios';
import { RiInformation2Fill } from "react-icons/ri";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import Spinner from '../components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { MdGroupAdd } from "react-icons/md";
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://employee-management-springboot-backend-1.onrender.com/api/v1/employees`);
      setLoading(false);
      setEmployees(res.data);
    } catch (error) {
      setLoading(false);
      toast.error("Error while fetching employees");
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteEmployee = async () => {
    setShowModal(false);
    if (!selectedEmployeeId) return;
    setLoading(true);
    try {
      await axios.delete(`https://employee-management-springboot-backend-1.onrender.com/api/v1/remove-emp/${selectedEmployeeId}`);
      setEmployees(employees.filter(emp => emp.empId !== selectedEmployeeId));
      setLoading(false);
      toast.success("Employee removed successfully.");
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error("Error while removing employee");
    }
  }
  const openDeleteModal = (empId) => {
    setShowModal(true);
    setSelectedEmployeeId(empId);
  }

  const closeDeleteModal = () => {
    setShowModal(false);
    setSelectedEmployeeId(null);
  }

  return (
    <div className='relative h-screen' style={{backgroundColor: "#f7faf8"}}>
      <DeleteConfirmationModal
        onConfirm={handleDeleteEmployee}
        onCancel={closeDeleteModal}
        show={showModal} />
      <Header />
      <div className='p-4 border-black'>
        <Link to="/addEmployee" className='flex items-center justify-center max-w-64 rounded-full m-auto' style={{backgroundColor: "#E9FF97"}}>
          <h1 className='font-semibold me-3 ' style={{ fontSize: "22px" }}>Add Employee</h1>
          <MdGroupAdd className=' size-14 text-green-500' />
        </Link>
        <h1 className=' font-mono font-semibold mt-4'>Total Employees: {employees.length}</h1>
        {
          loading ? <Spinner /> :
            <table className='w-full border border-spacing-2 mt-4 '>
              <caption className=' text-3xl text-orange-400 font-bold mb-3'>Employees's Details</caption>
              <thead>
                <tr className=' bg-sky-300'>
                  <th className='border border-slate-500'>Sr. No</th>
                  <th className='border border-slate-500'>First Name</th>
                  <th className='border border-slate-500'>Last Name</th>
                  <th className='border border-slate-500 hidden md:table-cell'>Gender</th>
                  <th className='border border-slate-500'>Job</th>
                  <th className='border border-slate-500 hidden lg:table-cell'>Employee Type</th>
                  <th className='border border-slate-500 hidden md:table-cell'>Email</th>
                  <th className='border border-slate-500 w-40'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  employees.map((emp, index) => {
                    return (
                      <tr className='border border-slate-500 hover:bg-slate-300 cursor-pointer' key={index}>
                        <td className='border border-slate-500 text-center'>{index + 1}</td>
                        <td className='border border-slate-500 text-center'>{emp.firstName}</td>
                        <td className='border border-slate-500 text-center'>{emp.lastName}</td>
                        <td className='border border-slate-500 text-center hidden md:table-cell'>{emp.gender}</td>
                        <td className='border border-slate-500 text-center'>{emp.jobTitle}</td>
                        <td className='border border-slate-500 text-center hidden lg:table-cell'>{emp.empType}</td>
                        <td className='border border-slate-500 text-center hidden md:table-cell'>{emp.email}</td>
                        <td className=' border-slate-500 flex justify-evenly' style={{backgroundColor: "#f7faf8"}}>
                          <div className='flex justify-evenly w-full'>
                            <Link to={`/employeeInfo/${emp.empId}`}>
                              <RiInformation2Fill className=' size-6 text-sky-500' />
                            </Link>
                            <Link to={`/updateEmployeeInfo/${emp.empId}`}>
                              <FaEdit className=' size-6 text-green-500' />
                            </Link>
                            <RiDeleteBin3Fill
                              onClick={() => openDeleteModal(emp.empId)}
                              className=' size-6 text-red-500' />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
        }
      </div>
      <ToastContainer />
    </div>
  )
}

export default DashboardPage
