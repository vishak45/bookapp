import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Swal from 'sweetalert2';
import logo from '../../assets/pics/open-book-green-icon-symbol-png-image-7017516950334616xtboj78tt-removebg-preview.png';
function Header() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/');
      }
    });
  };

  const token = localStorage.getItem('token');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-1">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
  <img
    src={logo}
    alt="Logo"
    className="logo-hover"
    style={{ width: 50, height: 50 }}
  />
  BookHive
</Link>


        {/* Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowDropdown(false)} // close dropdown on toggle
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav align-items-lg-center gap-lg-3 flex-column flex-lg-row ms-auto">
            <li className="nav-item">
  <Link
    className="nav-link hivebot-link"
    to="/hivebot"
    style={{
      color: '#fff',
      fontWeight: 600,
      letterSpacing: 1,
      position: 'relative',
      overflow: 'hidden',
      transition: 'color 0.2s',
    }}
  >
    <span
      style={{
        display: 'inline-block',
        transition: 'transform 0.3s cubic-bezier(.68,-0.55,.27,1.55)',
      }}
      className="hivebot-text"
    >
      🤖 HiveBot
    </span>
  </Link>
  <style>
    {`
      .hivebot-link:hover .hivebot-text {
        color: #28a745;
        transform: scale(1.12) rotate(-3deg);
        
        
      }
      @keyframes hivebot-glow {
        from { text-shadow: 0 2px 12px #28a74599, 0 0px 2px #fff; }
        to { text-shadow: 0 4px 24px #28a745cc, 0 0px 8px #fff; }
      }
    `}
  </style>
</li>
            <li className="nav-item">
              <Link className="nav-link" to="/filter">Categories</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About Us</Link>
            </li>
            <li className="nav-item" ref={dropdownRef} style={{ position: 'relative' }}>
              {token ? (
                <>
                  <Link className="nav-link"><span
                    className=" username-highlight"
                    style={{ cursor: 'pointer' ,color:"#28a745"}}
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {JSON.parse(localStorage.getItem('user')).name}
                  </span></Link>

                  {showDropdown && (
                    <div
                      className="dropdown-menu show"
                      style={{ right: 0, left: 'auto', position: 'absolute', top: '100%', zIndex: 1050 }}
                    >
                      <Link to="/readlist" className="dropdown-item">📕 Readlist</Link>
                      <Link to="/reviews" className="dropdown-item">💬 Reviews</Link>
                      <Link to="/updatepass" className="dropdown-item">🔑 Change Password</Link>
                      <span
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                      >
                        🚪 Logout
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <Link className="nav-link" to="/signin">Sign Up</Link>
              )}
            </li>

            {/* Search form full width on mobile, inline on desktop */}
            <li className="nav-item">
             
                
  <Link className="nav-link search-button" to="searchrecommend" style={{
    color: '#fff',
  }}>Search</Link>


              
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
