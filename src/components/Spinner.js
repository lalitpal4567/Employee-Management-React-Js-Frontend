import React from 'react'
import "./Spinner.css";

const Spinner = ({className}) => {
  return (
    <div className=' h-96 flex justify-center items-center'>
      <div className="spinner"></div>
    </div>
  )
}

export default Spinner
