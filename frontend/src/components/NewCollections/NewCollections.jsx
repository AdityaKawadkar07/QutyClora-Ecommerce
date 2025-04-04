import React, { forwardRef, useEffect, useState } from 'react'
import './NewCollections.css'
// import new_collection from '../assets/new_collections'
import Item from '../Item/Item'

const BACKEND_API_URL=process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';


const NewCollections = forwardRef((props, ref) => {

  const [new_collection,setNew_collection]=useState([]);

  useEffect(()=>{
    fetch(`${BACKEND_API_URL}/newcollections`)
    .then((response)=>response.json())
    .then((data)=>setNew_collection(data));
  },[])

  return (
    <div className='new-collections' ref={ref}>
        <h1>NEW ARRIVALS</h1>
        <hr />
        <div className="collections">
            {new_collection.map((item,i)=>{
                return <Item key={i} id={item.id} name={item.name} image={item.image[0]} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  );
});

export default NewCollections