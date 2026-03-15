import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosinstance/axiosInstance';
import { useNavigate } from 'react-router-dom';

function ReadList() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [bookInfo, setBookInfo] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/book/readlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
            console.log(res.data);
          setBookInfo(res.data);
        }
      } catch (error) {
        console.error('Error fetching readlist:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async (bookId) => {
    try {
      const res = await axiosInstance.delete(`/book/readlist/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        setBookInfo((prev) => prev.filter((book) => book.bookid !== bookId));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '2rem', color: '#fff' }}>
      <h2 style={{ color: '#28a745' }}>📚 Your Readlist</h2>

      {bookInfo.length === 0 ? (
        <p>No books in your readlist yet.</p>
      ) : (
        bookInfo.map((book) => (
          <div>
          <div
            key={book._id}
            style={{
              background: '#111',
              color: '#fff',
              borderLeft: '5px solid #28a745',
              padding: '1rem',
              margin: '1rem 0',
              display: 'flex',
              gap: '1rem',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onClick={() => navigate(`/book/${book.bookid}`)}
          >
            {/* Cover */}
            <img
              src={book.coverImage || 'https://via.placeholder.com/100x150?text=No+Image'}
              alt={book.title}
              style={{ width: '100px', height: '150px', objectFit: 'cover' }}
            />

            {/* Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h4>📖 {book.title}</h4>
              <p><strong>Author(s):</strong> {book.authors?.join(', ') || 'Unknown'}</p>
              <p><strong>Genre:</strong> {book.subject}</p>

              
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
          <button
                onClick={() => handleDelete(book.bookid)}
                style={{
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  alignSelf: 'flex-start',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
              </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReadList;
