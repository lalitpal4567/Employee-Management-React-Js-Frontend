import React from 'react'

const DeleteConfirmationModal = ({ onConfirm, onCancel, show }) => {
  if(show === false){
    return;
  }
  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50'>
      <div className=' h-[150px] w-[350px] bg-sky-200 rounded-md p-4 flex flex-col justify-between'>
        <p className=' font-semibold' style={{fontSize: "18px"}}>Are you sure you want to delete it?</p>
        <div className='flex justify-end gap-x-4'>
            <button onClick={onCancel} className='bg-green-400 py-3 px-8 rounded-md'>Cancel</button>
            <button onClick={onConfirm} className='bg-red-400 py-3 px-8 rounded-md'>Yes delete it</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
