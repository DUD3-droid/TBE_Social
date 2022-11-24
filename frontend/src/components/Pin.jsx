import React , {useState} from 'react'
import {Link , useNavigate} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import { urlFor , client } from '../client'
import { fetchUser } from '../utils/fetchUser'

const Pin = ({ pin: { postedBy , _id , image , destination  ,save } }) => {

    const [postHovered, setPostHovered] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [savingPost, setSavingPost] = useState(false)
    const navigate = useNavigate();
    const user = fetchUser();


    const alreadySaved = !!(save?.filter((item)=> item.postedBy._id === user?.sub )?.length);

    const savePin = (id) => {
        if(!alreadySaved){
            setSavingPost(true);
            
            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after' , 'save[-1]' , [{
                    _key: uuidv4(),
                    userId : user?.sub,
                    postedBy: {
                        _type : 'postedBy',
                        _ref: user?.sub
                    }
                }] ) 
                .commit()
                .then(()=> {
                    window.location.reload();
                    setSavingPost(false);
                })
        }
    }


    const deletePin = (id) =>{
        client
            .delete(id)
            .then(()=>{
                window.location.reload();
            })
    }

  return (
    <div className='m-2'>
        <div 
            onMouseEnter={()=> setPostHovered(true)}
            onMouseLeave={()=> setPostHovered(false)}
            onClick={() => navigate(`/pin-detail/${_id}`)}
            className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden trasition-all duration-500 ease-in-out'
        >
            <img className='rounded-lg w-full' src={urlFor(image).width(250).url()} alt="User-post"/>
            {postHovered && (
                <div 
                    className='absolute top-0 w-full h-full flex flex-col justify-between p-2 pl-1 z-50'
                    style={{height:'100%'}}
                >
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-2'>
                            <a
                                href={`${image?.asset?.url}?dl=`}
                                download
                                onClick={(e)=> e.stopPropagation()}
                                className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                            >
                                <MdDownloadForOffline />
                            </a>
                        </div>

                        {alreadySaved ? (
                            <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none'>
                              {save?.length}  Saved
                            </button>
                        ):(
                            <button 
                                type='button' 
                                className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none'
                                onClick={(e)=> {
                                    e.stopPropagation();
                                    savePin(_id)
                                }}
                            >
                                Save
                            </button>
                        )}
                    </div>

                    <div className='flex justify-between items-center w-full'>
                            
                        {postedBy?._id === user?.sub && (
                            <button 
                                type='button' 
                                className='bg-white opacity-70 hover:opacity-100 hover:bg-red-500 hover:text-white text-red font-bold px-3 py-3 text-base rounded-3xl hover:shadow-md outlined-none'
                                onClick={(e)=> {
                                    e.stopPropagation();
                                    deletePin(_id)
                                }}
                            >
                                <AiTwotoneDelete />
                            </button>
                        )}

                        {destination!==null && (
                            <a 
                                href={destination} 
                                target='_blank' 
                                rel='noreferrer'
                                className='bg-white hover:text-xl text-lg flex items-center text-black font-bold p-2 gap-2 rounded-full opacity-70 hover:opacity-70 hover:shadow-md'>
                                <BsFillArrowUpRightCircleFill />
                            </a>
                        )}

                        
                    </div>

                </div>
            )}
        </div>

        <Link to={`/user-profile/${postedBy._id}`} className='flex gap-2 mt-2 items-center'>
            <img 
                className='w-8 h-8 rounded-full object-cover'
                src={postedBy?.image}
                alt='/user-profile'
            />
            <p className='font-semibold capitalize'>{postedBy?.userName}</p>
        </Link>
    </div>
  )
}

export default Pin