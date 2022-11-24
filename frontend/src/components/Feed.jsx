import React, {useState , useEffect} from 'react'
import { useParams } from 'react-router-dom'

import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const Feed = () => {

  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null)
  const { categoryId } = useParams();

  useEffect(() => {
     if(categoryId){
        const query = searchQuery(categoryId);
        client.fetch(query)
        .then((data)=>{
          setPins(data)
        })


     }else{
      client.fetch(feedQuery)
      .then((data) =>{
        setPins(data)
      })

    }
    setLoading(false)

  }, [categoryId])
  

  if(loading) return <Spinner message="Adding new ideas to your feed" />
  
  
  if(!pins?.length) return <h2 className='text-gray-500 font-semibold w-full text-center'>No Pins Available</h2>;


  return (
    <div>
      {pins && <MasonryLayout pins={pins} /> }
    </div>
  )
}

export default Feed