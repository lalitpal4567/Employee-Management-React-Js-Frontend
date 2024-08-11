import React from 'react'
import { Link } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";


const BackButton = ({destination='/'}) => {
    return (
        <div>
            <Link to={destination}>
                <IoArrowBack className=' bg-sky-500 rounded-full h-10 w-10' />
            </Link>
        </div>
    )
}


export default BackButton
