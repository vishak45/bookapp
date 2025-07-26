import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function UpdatePass() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [oldpass, setOldpass] = useState('');
  const [newpass, setNewpass] = useState('');
  const [confirmpass, setConfirmpass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    }
  }, [token, navigate]);

  const validateInputs = () => {
    if (!oldpass || !newpass || !confirmpass) {
      setError('All fields are required.');
      return false;
    }
    if (newpass.length < 8) {
      setError('New password must be at least 8 characters.');
      return false;
    }
    if (newpass !== confirmpass) {
      setError("New and confirm passwords don't match.");
      return false;
    }
    if(newpass===oldpass)
    {
      setError("New password can't be same as old password.");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateInputs()) return;

    try {
      const res = await axios.put(
        'https://bookapp-2nn8.onrender.com/api/user/updatepassword',
        { oldpass, newpass },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.message) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Password updated successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.removeItem('token');
        navigate('/signin');
      }
    } catch (error) {
      console.error(error);
      setError(
        error?.response?.data?.message || 'Failed to update password.'
      );
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#181c1f', color: 'white' }}
    >
      <div
        className="p-4 rounded shadow"
        style={{
          backgroundColor: '#23272b',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #28a745',
        }}
      >
        <h3 className="text-center mb-3" style={{ color: '#28a745' }}>
          Update Password
        </h3>

        {error && (
          <div className="alert alert-danger py-1 text-center">{error}</div>
        )}

        <div className="form-group mb-3">
          <label>Current Password</label>
          <input
            type="password"
            className="form-control"
            value={oldpass}
            onChange={(e) => setOldpass(e.target.value)}
            placeholder="Enter old password"
          />
        </div>

        <div className="form-group mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newpass}
            onChange={(e) => setNewpass(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>

        <div className="form-group mb-3">
          <label>Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmpass}
            onChange={(e) => setConfirmpass(e.target.value)}
            placeholder="Re-enter new password"
          />
        </div>

        <button
          className="btn w-100"
          style={{ backgroundColor: '#28a745', color: 'white' }}
          onClick={handleUpdate}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export default UpdatePass;
