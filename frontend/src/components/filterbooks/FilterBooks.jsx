import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosinstance/axiosInstance'
import { useNavigate } from 'react-router-dom'
import '../Home.css'
function FilterBooks() {
    const navigate = useNavigate()
  const [genre, setGenre] = useState('action')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [genres, setGenres] = useState([
    'action', 'science_fiction', 'fantasy', 'romance', 'horror', 'mystery', 'thriller', 'adventure', 'biography', 'history', 'comics', 'drama'
  ])

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get(`/book/genre/${genre}`)
        if(response.data) {
          setBooks(response.data)
        }
      } catch (error) {
        setBooks([])
        console.log(error)
      }
      setLoading(false)
    }
    fetchBooks()
  }, [genre])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#181c1f',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        padding: 0,
        margin: 0,
        width: '100%',
      }}
    >
      <div className="container py-5" style={{ width: '100%' }}>
        <div className="navbar navbar-dark bg-dark rounded shadow mb-4" style={{ padding: '1.5rem 2rem', background: '#181c1f', borderRadius: 16 }}>
          <h2 className="navbar-brand mb-0" style={{ color: '#28a745', fontWeight: 700 }}>
            Filter Books by Genre
          </h2>
          <form className="d-flex ms-auto" style={{ maxWidth: 250 }}>
            <select
              className="form-select border-success"
              style={{
                fontWeight: 500,
                background: '#23272b',
                color: '#28a745',
                borderColor: '#28a745',
              }}
              value={genre}
              onChange={e => setGenre(e.target.value)}
            >
              {genres.map(g => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </form>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading books...</span>
            </div>
          </div>
        ) : (
          <div className="row g-2 justify-content-center">
            {books.length === 0 ? (
              <div className="text-center text-muted" style={{ fontSize: 20, marginTop: 40 }}>
                No books found for this genre.
              </div>
            ) : (
              books.map((book, index) => (
                <div
                  key={index}
                  className="col-12 col-sm-6 col-md-4 col-lg-2  d-flex justify-content-center text-center"
                >
                  <div
                    className="card shadow book-card"
                    style={{
                     border: 'none',
    borderRadius: '16px',
    width: 280,
    minHeight: 420,
    maxHeight: 420,
    background: '#23272b',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    overflow: 'hidden',
                    }}
                    onClick={()=>{
                      navigate(`/book/${book._id}`)
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
                          marginBottom: '0.75rem',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px #28a74522',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '220px',
                          background: 'linear-gradient(135deg, #28a74533 0%, #00000011 100%)',
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#28a745',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: 18,
                          letterSpacing: 1,
                        }}
                      >
                        No Image
                      </div>
                    )}
                    <div className="card-body p-2 d-flex flex-column align-items-center w-100">
                      <strong
                        style={{
                          color: '#28a745',
                          fontSize: 18,
                          marginBottom: 6,
                          fontWeight: 600,
                          letterSpacing: 0.5,
                        }}
                      >
                        {book.title}
                      </strong>
                      <span
                        style={{
                          color: '#fff',
                          background: '#28a745',
                          borderRadius: 8,
                          padding: '2px 10px',
                          fontWeight: 500,
                          fontSize: 15,
                          marginBottom: 2,
                          marginTop: 4,
                          display: 'inline-block',
                        }}
                      >
                        {book.subject || 'Unknown Genre'}
                      </span>
                      <em
                        style={{
                          color: '#bdbdbd',
                          fontSize: 14,
                          marginTop: 8,
                          display: 'block',
                          minHeight: 36,
                        }}
                      >
                        {book.authors?.join(', ') || 'Unknown Author'}
                      </em>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterBooks
