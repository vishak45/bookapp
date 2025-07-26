import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchRecommend.css'
import { useNavigate } from 'react-router-dom';
function SearchRecommend() {
    const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://bookapp-2nn8.onrender.com/api/book/all');
        if (response.data) {
          setBooks(response.data); // only show first 100

          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    (book.authors && book.authors.join(' ').toLowerCase().includes(query.toLowerCase()))||
    book.subject.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '2rem', color: '#fff' }}>
      <h2 style={{ color: '#28a745', marginBottom: '1rem' }}>Search Books</h2>

      <input
        type="text"
        placeholder="Search by title,genre or author..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          width: '100%',
          maxWidth: '500px',
          border: '2px solid #28a745',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          color: '#fff',
          backgroundColor: '#111'
        }}
      />
    <div>
      {loading && <p style={{
        color: '#28a745',
        fontSize: '1.2rem',
      }}>Loading books please wait...</p>}
    </div>
      <div>
        {query && filteredBooks.length === 0 && (
          <p style={{ color: '#aaa' }}>No matching books found.</p>
        )}

        {filteredBooks.slice(0, 100).map((book, index) => (
          <div
          className='book-card'
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#111',
              padding: '1rem',
              marginBottom: '1rem',
              borderLeft: '5px solid #28a745',
              borderRadius: '5px',
              cursor: 'pointer',
              
            }}
            onClick={() => navigate(`/book/${book._id}`)}
          >
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                style={{
                  width: '80px',
                  height: '120px',
                  objectFit: 'cover',
                  marginRight: '1rem',
                  borderRadius: '5px',
                  border: '1px solid #28a745'
                }}
              />
            )}
            <div>
              <h3 style={{ margin: '0 0 0.5rem', color: '#28a745' }}>{book.title}</h3>
              <p style={{ margin: 0, color: '#ccc' }}>
                Author(s): {book.authors ? book.authors.join(', ') : 'Unknown'}
              </p>
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
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchRecommend;
