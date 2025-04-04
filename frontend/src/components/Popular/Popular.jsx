import React, { useEffect, useState } from 'react'
import './Popular.css';
// import data_product from '../assets/data'
import Item from '../Item/Item';

const BACKEND_API_URL=process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';


const Popular = () => {

  const [popularProducts,setPopularProducts]=useState([]);

  useEffect(()=>{
    fetch(`${BACKEND_API_URL}/popular`)
    .then((response)=>response.json())
    .then((data)=>setPopularProducts(data))
  },[])

  return (
    <div className='popular'>
        <h1>POPULAR</h1>
        <hr/>
        <div className="popular-item">
            {popularProducts.map((item,i)=>{
                return <Item key={i} id={item.id} name={item.name} image={item.image[0]} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default Popular