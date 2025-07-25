import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
function Register() {
  const navigate=useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [emailerror, setEmailerror] = useState('');
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validate()) {
      try{
        const res=await axios.post('http://localhost:3000/api/user/register',{name,email,password});
      console.log(res.data);
      if(res.data)
      {
         Swal.fire({
          title: "Registration successful!",
          confirmButtonColor: '#28a745',
          icon: "success",
        });
        navigate("/signin");
      }
      }
      catch(error)
      {
        console.log(error);
        setEmailerror(error.response.data.message);
      }
      
    }
  };

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
          width: 370,
          padding: '2rem 1.5rem',
          borderRadius: 16,
          background: '#23272b',
          color: '#fff',
        }}
      >
        <div>
          {
            emailerror && (
              <div style={{
                color: 'red',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                {emailerror}
              </div>
            )
          }
        </div>
        <h3 className="mb-4 text-center" style={{ color: '#28a745', fontWeight: 700 }}>
          Register
        </h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label" style={{ color: '#28a745' }}>
              Name
            </label>
            <input
              type="text"
              className={`form-control border-success${errors.name ? ' is-invalid' : ''}`}
              id="name"
              placeholder="Enter your name"
              style={{
                background: '#181c1f',
                color: '#fff',
                borderColor: '#28a745',
              }}
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ color: '#28a745' }}>
              Email address
            </label>
            <input
              type="email"
              className={`form-control border-success${errors.email ? ' is-invalid' : ''}`}
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
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ color: '#28a745' }}>
              Password
            </label>
            <input
              type="password"
              className={`form-control border-success${errors.password ? ' is-invalid' : ''}`}
              id="password"
              placeholder="Password (min 8 chars)"
              style={{
                background: '#181c1f',
                color: '#fff',
                borderColor: '#28a745',
              }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
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
            Register
          </button>
        </form>
        <div className="mt-3 text-center">
          <span style={{ color: '#bdbdbd' }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: '#28a745', textDecoration: 'underline' }}>
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register