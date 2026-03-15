import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosinstance/axiosInstance';
import Swal from 'sweetalert2';

function ReviewFilter() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/book/reviews', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          setReviews(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [navigate, token]);

  const handleDelete = async (bookid, reviewid) => {
    try {
      const confirm = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this review!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!',
      });

      if (confirm.isConfirmed) {
        const res = await axiosInstance.delete(`/book/review/${bookid}/${reviewid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.message) {
          setReviews(reviews.filter((r) => r._id !== reviewid));
          
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#23272b', minHeight: '100vh', color: 'white' }}>
      <h2 className="text-center mb-4" style={{ color: '#28a745' }}>📚 Your Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-center">You haven't posted any reviews yet.</p>
      ) : (
        <div className="row justify-content-center">
          {reviews.map((review) => (
            <div key={review._id} className="col-md-10 col-lg-8" style={{
                width: '80%',
                margin:'auto'
            }}>
              <div className="card mb-4 shadow-sm" style={{ backgroundColor: '#2c2f33', border: '1px solid #28a745' }}>
                <div className="row g-0">
                  <div className="col-md-2 d-flex align-items-center justify-content-center p-2">
                    <img
                      src={review.coverImage || 'https://via.placeholder.com/100x140?text=No+Image'}
                      alt={review.title}
                      className="img-fluid rounded"
                      style={{ height: '220px', width: '250px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-10">
                    <div className="card-body py-3 px-4 d-flex flex-column justify-content-between h-100">
                      <div style={{
                        color: 'white',
                        cursor: 'pointer'
                        
                      }} >
                        <h5 className="card-title mb-2" style={{ color: '#28a745' }}>{review.title}</h5>
                        <h6 className="card-subtitle mb-2 mt-3">Rating: {review.rating} ⭐</h6>
                        <p>{review.comment}</p>
                        <p className="card-text">
                          <small >Posted on {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}</small>
                        </p>
                        <button style={{ backgroundColor: '#28a745', color: 'white' }} className="btn btn-sm" onClick={() => navigate(`/book/${review.bookid}`)}>See Details</button>
                      </div>
                      <div className="text-end">
                        <button
                          onClick={() => handleDelete(review.bookid, review._id)}
                          className="btn btn-sm"
                          style={{ backgroundColor: '#28a745', color: 'white' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewFilter;
