import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

const API_BASE_URL=import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";


const ListProduct = () => {

  const [allproducts,setAllProducts] = useState([]);

  const fetchInfo = async()=>{
    await fetch(`${API_BASE_URL}/allproducts`)
    .then((res)=>res.json())
    .then((data)=>{setAllProducts(data)});
  }

useEffect(()=>{
  fetchInfo();
},[])

const remove_product = async(id)=>{
  await fetch(`${API_BASE_URL}/removeproduct`,{
    method:'POST',
    headers:{
      Accept:'application/json',
      'Content-Type':'application/json',
    },
    body:JSON.stringify({id:id})
  })
  await fetchInfo();
}

  return (
    <div className='list-product'>
        <h1>All Products List</h1>
        <div className="listproduct-header">
          <p>Products</p>
          <p>Title</p>
          <p>Old Price</p>
          <p>New Price</p>
          <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
          {allproducts.map((product,index)=>{
              return <><div key={index} className="listproduct-row">
                <img src={product.image[0]} alt="" className="listproduct-product-icon" />
                <p>{product.name}</p>
                <p>₹{product.old_price}</p>
                <p>₹{product.new_price}</p>
                <img onClick={()=>{remove_product(product.id)}} className='listproduct-remove-icon' src={cross_icon} alt="" />
              </div>
              </>
          })}
        </div>
    </div>
  )
}

export default ListProduct