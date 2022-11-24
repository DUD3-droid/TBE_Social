import React, { useState , useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams , useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'


import { userCreatedPinsQuery , userQuery , userSavedPinsQuery } from '../utils/data'
import { fetchUser } from '../utils/fetchUser';
import {client} from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const randomImg = 'https://source.unsplash.com/1600x900/?textures-patterns,wallpapers'

const activeBtnStyle = 'bg-blue-500 text-white font-bold p-2 rounded-full w-20 outline-none'
const nonActiveBtnStyle = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'

const Userprofile = () => {
  
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('Created')
  const [activeBtn, setActiveBtn] = useState('created')
  const navigate = useNavigate();

  const { userId } = useParams();

  const User = fetchUser();

  useEffect(()=>{
    const query = userQuery(userId)
    
    client.fetch(query)
    .then((data) => {
      setUser(data[0]);
    })

  } , [userId])

  useEffect(()=>{
    if(text==='Created'){
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery)
      .then(data=>
        setPins(data)
      )
    }else{
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery)
      .then(data=>
        setPins(data)
      )
    }

  },[text , userId])

  const logoutHandle = () =>{
    googleLogout();
    localStorage.clear();
    navigate('/login');
  }



  if(!user) return <Spinner message={'Loading Profile...'} />

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img 
              src={randomImg}
              className='w-full h-[120px] lg:h-[250px]   shadow-lg object-cover'
              alt='Banner pic'
            />

            <img 
              src={user?.image}
              className='rounded-full w-28 h-28 -mt-16 shadow-xl object-cover'
              alt='User pic'
            />
            <h1 className='font-bold text-3xl text-center mt-3'>{user?.userName}</h1>
            <div className='absolute top-4 right-4 z-1 ring-0 p-2'>
              {userId === User?.sub && (
                <button 
                  type='button'
                  className='bg-white rounded-full cursor-pointer outline-none shadow-md p-3'
                  onClick={logoutHandle}
                >
                <AiOutlineLogout color='red' fontSize={21} /> 
                </button>
              )}
            </div>
          </div>

          <div className='text-center mb-7 mt-4'>
            <button 
              type='button'
              onClick={(e)=> {
                setText(e.target.textContent)
                setActiveBtn('created');
              }}
              className={activeBtn === 'created' ? activeBtnStyle : nonActiveBtnStyle}
            >
              Created
            </button>

            <button 
              type='button'
              onClick={(e)=> {
                setText(e.target.textContent)
                setActiveBtn('saved');
              }}
              className={activeBtn === 'saved' ? activeBtnStyle : nonActiveBtnStyle}
            >
              Saved
            </button>
          </div>

          {pins?.length>0 ? (
            <div className='px-2'>
              <MasonryLayout pins={pins} />
            </div>
          ):(
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              No Pins Found!
            </div>
          )}
          

        </div>
      </div>
    </div>
  )
}

export default Userprofile