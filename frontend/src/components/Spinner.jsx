import React from 'react'
import { Triangle } from 'react-loader-spinner'

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full '>
        <Triangle
            color='#00BFFF'
            height={80}
            width={200}
            className='m-5'
        />

        <p className='text-lg text-center px-2'>{message}</p>
    </div>
  )
}

export default Spinner