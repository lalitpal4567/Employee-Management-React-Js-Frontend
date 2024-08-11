import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import AddEmployeePage from './pages/AddEmployeePage'
import InformationPage from './pages/InformationPage'
import UpdateContentPage from './pages/UpdateContentPage'
import ErrorPage from './pages/ErrorPage'

const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />}></Route>
      <Route path="/addEmployee/" element={<AddEmployeePage />}></Route>
      <Route path='/employeeinfo/:id' element={<InformationPage />}></Route>
      <Route path='/updateEmployeeInfo/:id' element={<UpdateContentPage />}></Route>
      <Route path="*" element={<ErrorPage/>}></Route>
    </Routes>
  )
}

export default AppRoute
