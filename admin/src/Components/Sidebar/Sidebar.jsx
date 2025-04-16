import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom';
import add_product_icon from "../../assets/Product_Cart.svg"
import list_product_icon from "../../assets/Product_list_icon.svg"
import { FaGift } from "react-icons/fa";

const Sidebar = ({closeSidebar}) => {
  return (
    <div className='sidebar'>
        <Link to={'/admin/addproduct'} onClick={closeSidebar} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={add_product_icon} alt="" />
                <p>Add Product</p>
            </div>
        </Link>
        <Link to={'/admin/listproduct'} onClick={closeSidebar} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={list_product_icon} alt="" />
                <p>Product List</p>
            </div>
        </Link>
        <Link to={'/admin/userlist'} onClick={closeSidebar} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={list_product_icon} alt="" />
                <p>User List</p>
            </div>
        </Link>
        <Link to={'/admin/orders'} onClick={closeSidebar} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={list_product_icon} alt="" />
                <p>Orders</p>
            </div>
        </Link>
        <Link to={'/admin/usermessage'} onClick={closeSidebar} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={list_product_icon} alt="" />
                <p>User Messages</p>
            </div>
        </Link>
        <Link to={'/admin/add-coupon'} onClick={closeSidebar} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <FaGift size={30} color="red" />
                <p>Add Coupon</p>
            </div>
        </Link>
    </div>
  )
}

export default Sidebar