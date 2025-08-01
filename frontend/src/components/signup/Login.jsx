import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

import axiosInstance from '../../axiosinstance/axiosInstance';
function Login() {
  const navigate=useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState('');
  const handleLogin=async(e)=>{
     e.preventDefault();
    try{
      const response=await axiosInstance.post('/user/login',{email,password});
      console.log(response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.userExist));
        toast.success('Login Successful', {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    theme: 'dark',
   
    style: {
      background: '#090909',
      color: '#28a745',
      fontWeight: '600',
      borderRadius: '8px',
    },
    progressStyle: {
      background: '#28a745',
    },
    onClose: () => navigate('/'),
  });
      }
     
    }
    catch(error)
    {
      setError(error.response.data.message);
      console.log(error);
    }
  }
  return (
    
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        background: '#181c1f',
      }}
    >
      
      <div
        className="card shadow"
        style={{
          width: 350,
          padding: '2rem 1.5rem',
          borderRadius: 16,
          background: '#23272b',
          color: '#fff',
        }}
      >
        {
      error?(<div style={{color:'#dc3545',padding:'0.5rem',textAlign:'center'}}>📚{error}</div>):(null)
    }
        <h3 className="mb-4 text-center" style={{ color: '#28a745', fontWeight: 700 }}>
          Login
        </h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ color: '#28a745' }}>
              Email address
            </label>
            <input
              type="email"
              className="form-control border-success"
              id="email"
              placeholder="Enter email"
              style={{
                background: '#181c1f',
                color: '#fff',
                borderColor: '#28a745',
              }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ color: '#28a745' }}>
              Password
            </label>
            <input
              type="password"
              className="form-control border-success"
              id="password"
              placeholder="Password"
              style={{
                background: '#181c1f',
                color: '#fff',
                borderColor: '#28a745',
              }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              background: '#28a745',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 8,
              marginTop: 8,
            }}
            
          >
            Login
            
          </button>
        </form>
        <div className="mt-3 text-center">
          <span style={{ color: '#bdbdbd' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#28a745', textDecoration: 'underline' }}>
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Login
