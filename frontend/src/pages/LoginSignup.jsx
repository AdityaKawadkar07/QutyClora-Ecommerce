import React, { useState } from 'react'
import { Link } from 'react-router-dom'; // Import Link for routing
import './CSS/LoginSignup.css'

const BACKEND_API_URL=process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

const LoginSignup = () => {

  const [state,setState]=useState("Login");
  const [formData,setFormData] = useState({
    username:"",
    password:"",
    email:""
  })

  const login=async()=>{
    console.log("Login Function Executed",formData);
    let responseData;
    await fetch(`${BACKEND_API_URL}/login`,{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      localStorage.setItem('user-id', responseData.userId);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
  }

  const signup=async()=>{
    console.log("SignUp Function Executed",formData);
    let responseData;
    await fetch(`${BACKEND_API_URL}/signup`,{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      localStorage.setItem('user-id', responseData.id);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
  }

  const changeHandler = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name'/>:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password'/>
          <p>
            <Link to="/forgotpassword" className="forgot-password-link">Forgot Password??</Link>
          </p>
        </div>
        <button onClick={()=>{state==='Login'?login():signup()}}>Continue</button>
        {state==="Sign Up"
        ?<p className='loginsignup-login'>Already have an account? <span className='loginsignup-click' onClick={()=>{setState("Login")}}>Login here</span></p>
        :<p className='loginsignup-login'>Create an account? <span className='loginsignup-click' onClick={()=>{setState("Sign Up")}}>Click here</span></p>
        }
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id=''/>
          <p>By continuing, I agree to the terms of use and privacy policy</p>
        </div>
      </div>
      
    </div>
  )
}

export default LoginSignup
