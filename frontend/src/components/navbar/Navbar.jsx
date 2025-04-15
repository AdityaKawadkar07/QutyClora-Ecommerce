import React, { useContext, useRef, useState, useEffect } from 'react'
import './Navbar.css'
import logo from '../assets/logo.png'
import cart_icon from '../assets/cart_icon.png'
import { Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import nav_dropdown from '../assets/dropdown_icon.png'

const Navbar = () => {
  const location  = useLocation();
  const path = location.pathname.split('/')[1];
  const [menu, setMenu] = useState(path || 'home')
  const { getTotalCartItems } = useContext(ShopContext)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const menuRef = useRef();
  const dropdownRef = useRef(); // Reference for dropdown icon

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('auth-token')
      if (token) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/verifytoken`,
            {
              headers: {
                'auth-token': token,
              },
            }
          )
          if (response.ok) {
            setIsLoggedIn(true)
          } else {
            localStorage.removeItem('auth-token')
            window.location.reload()
          }
        } catch (error) {
          localStorage.removeItem('auth-token')
          window.location.reload()
        }
      }
    }
    verifyToken()

      // 👇 Add this block to sync active menu with route
  const currentPath = location.pathname.split('/')[1];
  if (currentPath === '') {
    setMenu('home');
  } else if (currentPath === 'contactus') {
    setMenu('contact');
  } else {
    setMenu(currentPath);
  }
  }, [location.pathname])

// Toggle dropdown menu
const dropdown_toggle = (e) => {
  if (menuRef.current) {
    menuRef.current.classList.toggle('nav-menu-visible');
  }
  if (dropdownRef.current) {
    dropdownRef.current.classList.toggle('open');
  }
};

// Close dropdown when clicking an option
const handleMenuClick = (selectedMenu) => {
  setMenu(selectedMenu);

  // Ensure refs are defined before trying to modify classList
  if (menuRef.current) {
    menuRef.current.classList.remove('nav-menu-visible'); // Hide menu
  }
  if (dropdownRef.current) {
    dropdownRef.current.classList.remove('open'); // Reset dropdown icon
  }
};


  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt='Logo' />
      </div>
      <img className='nav-dropdown' src={nav_dropdown} onClick={dropdown_toggle} alt='Dropdown' />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={() => handleMenuClick('home')}>
          <Link style={{ textDecoration: 'none', color: menu === 'home' ? 'red' : 'black' }} to='/'>
            Home
          </Link>
          {menu === 'home' ? <hr /> : null}
        </li>
        <li onClick={() => handleMenuClick('about')}>
          <Link style={{ textDecoration: 'none', color: menu === 'about' ? 'red' : 'black' }} to='/about'>
            About
          </Link>
          {menu === 'about' ? <hr /> : null}
        </li>
        <li onClick={() => handleMenuClick('shop')}>
          <Link style={{ textDecoration: 'none', color: menu === 'shop' ? 'red' : 'black' }} to='/shop'>
            Shop
          </Link>
          {menu === 'shop' ? <hr /> : null}
        </li>
        <li onClick={() => handleMenuClick('contact')}>
          <Link
            style={{ textDecoration: 'none', color: menu === 'contact' ? 'red' : 'black' }}
            to='/contactus'
          >
            Contact
          </Link>
          {menu === 'contact' ? <hr /> : null}
        </li>

        {/* New "My Orders" link (visible only when logged in) */}
        {localStorage.getItem('auth-token') && (
  <li onClick={() => setMenu("myorder")}>
    <Link
      style={{
        textDecoration: 'none',
        color: menu === "myorder" ? 'red' : 'black',
      }}
      to={`/my-order/${localStorage.getItem('user-id')}`}
    >
      My Orders
    </Link>
    {menu === "myorder" ? <hr /> : <></>}
  </li>
)}

      </ul>

      <div className='nav-login-cart'>
        {isLoggedIn ? (
          <button
            onClick={() => {
              localStorage.removeItem('auth-token')
              localStorage.removeItem('user-id')
              window.location.replace('/')
            }}
          >
            Logout
          </button>
        ) : (
          <Link to='/login'>
            <button>Login</button>
          </Link>
        )}
        <Link to='/cart'>
          <img src={cart_icon} alt='Cart' />
        </Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar
