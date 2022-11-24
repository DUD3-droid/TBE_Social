import React from 'react'
import { useNavigate } from 'react-router-dom';
import {FcGoogle} from 'react-icons/fc'
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

import {client} from '../client'
import shareVideo from '../assets/share.mp4';
import logoWhite from '../assets/logowhite.png';

const Login = () => {

    const navigate = useNavigate();

    const handleSuccess = (response) =>{
        const profileObj = jwt_decode(response.credential);
        localStorage.setItem('user' , JSON.stringify(profileObj))

        const { name , picture , sub } = profileObj

        const doc = {
            _id : sub,
            _type : 'user',
            userName : name, 
            image : picture
        }

        client.createIfNotExists(doc)
        .then(()=>{
            navigate('/' , {replace:true})
        })
    }

   
  return (
    <div className='flex justify-start items-center flex-col h-screen'>

        <div className='w-full h-full'>
            <video 
                src={shareVideo}
                type='video/mp4'
                loop
                control={"false"}
                muted
                autoPlay
                className='w-full h-full object-cover'
            />
            <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                <div className='p-5'>
                    <img src={logoWhite} alt='Logo' />
                </div>

                <div className='shadow-2xl'>
                    <GoogleLogin
                        onSuccess={credentialResponse => {handleSuccess(credentialResponse)}}
                        onError={() => {alert("Login Failed! Please try again later.")}}
                        className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                        theme='outline'
                        size='medium'
                        text={<FcGoogle className='mr-4'/> + " Sign In With Google"}
                        cancel_on_tap_outside
                    />;
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login