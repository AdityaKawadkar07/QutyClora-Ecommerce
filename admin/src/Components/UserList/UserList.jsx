import React, { useEffect, useState } from 'react';
import './UserList.css';
import cross_icon from '../../assets/cross_icon.png';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const UserList = () => {
    const [allUsers, setAllUsers] = useState([]);

    const fetchInfo = async () => {
        await fetch(`${API_BASE_URL}/allusers`)
            .then((res) => res.json())
            .then((data) => {
                setAllUsers(data);
            });
    };

    // Function to calculate total items in cart
    const calculateCartItems = (cartData) => {
        if (!cartData) return 0;
        return Object.values(cartData).reduce((sum, quantity) => sum + quantity, 0);
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const remove_user = async(id)=>{
        await fetch(`${API_BASE_URL}/removeuser`,{
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
        <div className='userlist'>
            <h1>All User List</h1>
            <div className="userlist-header">
                <p>Name</p>
                <p>Email</p>
                <p>Items in Cart</p>
                <p>Remove</p>
            </div>

            <div className="userlist-allusers">
                {allUsers.map((user, index) => (
                    <div key={index} className="userlist-row">
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p>{calculateCartItems(user.cartData)}</p>
                        <img src={cross_icon} className='userlist-remove-icon' alt="Remove" onClick={() => remove_user(user._id)} />

                    </div>

                ))}
            </div>
        </div>
    );
};

export default UserList;
