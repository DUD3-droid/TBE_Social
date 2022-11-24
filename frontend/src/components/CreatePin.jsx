import React , {useState} from 'react' 
import { AiOutlineCloudUpload } from 'react-icons/ai'  
import { MdDelete } from 'react-icons/md'  
import { useNavigate } from 'react-router-dom'

import { client  } from '../client'
import Spinner from './Spinner'
import { categories } from '../utils/data'

const CreatePin = ({ user }) => {

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false);
  const [feilds, setFeilds] = useState(null)
  const [category, setCategory] = useState(null)
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)
  const [isvalidUrl, setIsvalidUrl] = useState(true)

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type , name } = e.target.files[0];

    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff'){
      setWrongImageType(false);
      setLoading(true)

      client.assets
        .upload('image' , e.target.files[0] , {contentType: type , filename: name})
        .then((document)=> {
          setImageAsset(document);
          setLoading(false)
        })
        .catch((error)=> {
          alert("Image Upload Error! Please Reload the page and try again.")
        })
    }
    else{
      setWrongImageType(true);
    }
  }

  const savePin = () => {
    if(title && isvalidUrl && about && imageAsset?._id && category){
      const doc = {
        _type:'pin',
        title , about , destination , 
        image: {
          _type: 'image',
          asset: {
            _type:'reference',
            _ref:imageAsset?._id
          }
        },
        userId: user?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user?._id
        },
        category
      }

      client.create(doc)
      .then(()=>{
        navigate('/')
      })
    } else {
      setFeilds(true);

      setTimeout(()=> setFeilds(false) , 2000)
    }
  }


  //Check the valid url
  function validURL(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    
      if(url !== '') pattern.test(url) ? setIsvalidUrl(true) : setIsvalidUrl(false);
      else setIsvalidUrl(true)
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {feilds && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please Fill in all detail properly!</p>
      )}


      <div className='flex lg:flex-row flex-col justify-center items-center bg-white p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full lg:mr-6'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {loading &&  <Spinner />}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label>
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl mt-5'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-lg'> Click to Upload </p>
                  </div>
                  <p className='mt-28 text-gray-400 text-center'>
                    Use high quality JPG, SVG, PNG, GIF less than 20MB  
                  </p>
                </div>
                <input 
                  type='file'
                  name='upload-image'
                  onChange={uploadImage}
                  className='w-0 h-0'
                />
              </label>
            ) : (
              <div className='relative h-full'>
                <img src={imageAsset?.url} alt='Uploaded pic' className='w-full h-full' />
                <button 
                  type='button' 
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={()=> setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-6  pl-5 mt-5 w-full'>
          <input 
            type='text'
            value={title}
            onChange={(e)=> setTitle(e.target.value)}
            placeholder='Add you title here'
            className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
          />
          <input 
            type='text'
            value={about}
            onChange={(e)=> setAbout(e.target.value)}
            placeholder='Let people know about your image'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          />

          <input 
            type='url'
            value={destination}
            onChange={(e)=> setDestination(e.target.value)}
            onBlur={()=> validURL(destination)}
            placeholder='Add destination Url'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 pb-0'
          />
          {!isvalidUrl && <p className='text-red-500 text-md transition-all duration-150 ease-in'>Invalid URL! Please enter a valid URL.</p>}


          <div className='felx flex-col'>
            <div>
              <p className='mb-2 font-semibold text-lg sm:text-xl'>Choose Pin Category</p>
              <select
                onChange={(e)=>setCategory(e.target.value)}
                className='w-full px-3 py-1.5 outline-none text-base border-b-2 border-gray-200 rounded-md cursor-pointer'
              >
                <option value='other' className='bg-white'> Select Category </option>

                {categories.map((category) => (
                  <option key={category.name} value={category.name} className='text-base outline-none capitalize bg-white text-black'> {category.name} </option>
                ))}
              </select>
            </div>
            <div className='flex justify-end items-end mt-5'>
              <button 
                type='button'
                onClick={savePin}
                className='bg-blue-500 text-white font-bold p-2 rounded-full w-28 outline-none'
              >
                  Save Pin
                </button>
            </div>
          </div>

          {user && (
            <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
              <img src={user?.image} className='w-10 h-10 rounded-full' alt={user?.userName} />
              <p className='font-bold'>{user?.userName}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default CreatePin