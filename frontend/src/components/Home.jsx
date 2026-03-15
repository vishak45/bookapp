import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosinstance/axiosInstance';
import './Home.css';
import WelcomePage from './WelcomePage';

function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreFilter, setGenreFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 20;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/book/all?page=${currentPage}&limit=${booksPerPage}`);
        setBooks(response.data.books);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]);

  // Get unique genres for dropdown
 

  // Filter books by selected genre
  const filteredBooks =
    genreFilter === 'All'
      ? books
      : books.filter((book) => book.subject === genreFilter);

  return (
    <div>
      <div><WelcomePage /></div>

      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          background: '#181c1f',
          fontFamily: 'Segoe UI, Arial, sans-serif',
          padding: 0,
          margin: 0,
        }}
      >
        <div className="container py-5" style={{ maxWidth: '100%' }}>
          <div
            className="navbar navbar-dark bg-dark rounded shadow mb-4"
            style={{
              padding: '1.5rem 2rem',
              background: '#181c1f',
              boxShadow: '0 8px 32px rgba(40,167,69,0.15)',
              borderRadius: 16,
            }}
          >
            <h1
              className="navbar-brand mb-0"
              style={{
                color: '#28a745',
                fontWeight: 700,
                letterSpacing: 1,
                fontSize: '2.2rem',
                textShadow: '0 2px 8px #0002',
              }}
            >
              📚 BookHive
            </h1>
            
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading books...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="row g-4 p-3 justify-content-center">
  {filteredBooks.length === 0 ? (
    <div
      className="text-center"
      style={{
        fontSize: 20,
        marginTop: 60,
        color: '#28a745',
        fontWeight: 500,
        letterSpacing: 1,
      }}
    >
      No books found.
    </div>
  ) : (
    filteredBooks.map((book, index) => (
      <div
        key={index}
        className="col-12 col-sm-6 col-md-4 col-lg-2 d-flex justify-content-center"
      >
        <div
          className="card shadow-lg book-card h-100"
          style={{
            border: 'none',
            borderRadius: '16px',
            width: 280,
            maxHeight: 420,
            background: '#23272b',
            color: '#fff',
            transition: 'transform 0.3s ease-in-out',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          onClick={() => navigate(`/book/${book._id}`)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="card-img-top"
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                boxShadow: '0 2px 8px #28a74555',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '220px',
                background: 'linear-gradient(135deg, #28a74533 0%, #00000011 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#28a745',
                fontWeight: 600,
                fontSize: 18,
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                letterSpacing: 1,
              }}
            >
              No Image
            </div>
          )}

          <div className="card-body px-3 py-3 text-center d-flex flex-column align-items-center justify-content-between">
            <h5
              className="card-title mb-2"
              style={{
                color: '#28a745',
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: 0.5,
                minHeight: 45,
              }}
            >
              {book.title}
            </h5>

            <span
              className="badge"
              style={{
                backgroundColor: '#28a745',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {book.subject || 'Unknown Genre'}
            </span>

            <p
              className="card-text mt-3 mb-0"
              style={{
                color: '#bdbdbd',
                fontStyle: 'italic',
                fontSize: 14,
                minHeight: 36,
              }}
            >
              {book.authors?.join(', ') || 'Unknown Author'}
            </p>
          </div>
        </div>
      </div>
    ))
  )}
</div>


              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center my-4 gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="btn btn-outline-success"
                    disabled={currentPage === 1}
                  >
                    ◀ Prev
                  </button>
                  <span className="text-white mx-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="btn btn-outline-success"
                    disabled={currentPage === totalPages}
                  >
                    Next ▶
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
