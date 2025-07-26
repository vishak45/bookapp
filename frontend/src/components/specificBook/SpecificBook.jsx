import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

function SpecificBook() {
  

  const token=localStorage.getItem('token');
  const user=JSON.parse(localStorage.getItem('user'));
  const dispUser=user?user.name:'Guest';
 const genreInfoMap = {
  science_fiction: {
    why: "Science fiction explores futuristic concepts, space, time travel, and the impact of science on society.",
    bestFor: ["Tech enthusiasts", "Futurists", "Fans of alternate realities"],
    trivia: "The term 'robot' was first introduced in a 1920 sci-fi play by Karel Čapek."
  },
  fantasy: {
    why: "Fantasy immerses readers in magical worlds with mythical creatures and epic quests.",
    bestFor: ["Fans of mythical creatures", "Lovers of epic sagas", "Dreamers of magical realms"],
    trivia: "J.R.R. Tolkien is considered the father of modern fantasy literature."
  },
  romance: {
    why: "Romance focuses on love, emotional bonds, and personal relationships.",
    bestFor: ["Hopeless romantics", "Drama lovers", "Fans of emotional storytelling"],
    trivia: "Romance is the most profitable fiction genre, making billions annually."
  },
  horror: {
    why: "Horror provokes fear through suspense, supernatural elements, and dark themes.",
    bestFor: ["Students", "Young adults", "Adults"],
    trivia: "Mary Shelley’s 'Frankenstein' is considered one of the first horror novels."
  },
  mystery: {
    why: "Mystery revolves around solving crimes, secrets, or puzzles.",
    bestFor: ["Amateur detectives", "Puzzle solvers", "Fans of hidden clues"],
    trivia: "Sherlock Holmes first appeared in 1887 in 'A Study in Scarlet'."
  },
  thriller: {
    why: "Thrillers are fast-paced, high-stakes stories filled with tension and danger.",
    bestFor: ["Adrenaline seekers", "Fans of twists and turns", "Suspense lovers"],
    trivia: "The genre often overlaps with crime, mystery, and psychological fiction."
  },
  action: {
    why: "Action stories are packed with physical feats, chases, and battles.",
    bestFor: ["Fans of non-stop excitement", "Lovers of heroic acts", "Blockbuster enthusiasts"],
    trivia: "Action books often form the basis for blockbuster movies."
  },
  adventure: {
    why: "Adventure involves exciting journeys, exploration, and unexpected challenges.",
    bestFor: ["Explorers at heart", "Fans of survival stories", "Journey lovers"],
    trivia: "‘The Adventures of Huckleberry Finn’ is a classic American adventure novel."
  },
  biography: {
    why: "Biographies tell real-life stories of notable people, revealing their struggles and achievements.",
    bestFor: ["History buffs", "Aspiring leaders", "Curious minds"],
    trivia: "The most-read biography in history is probably 'The Diary of Anne Frank'."
  },
  history: {
    why: "Historical books transport readers to past eras, blending facts with narrative.",
    bestFor: ["Time travelers", "Culture explorers", "Lovers of the past"],
    trivia: "Hilary Mantel made history by winning the Booker Prize twice for historical fiction."
  },
  comics: {
    why: "Comics combine art and story to create visual, fast-paced narratives.",
    bestFor: ["Visual learners", "Superhero fans", "Humor seekers"],
    trivia: "The first modern comic book was published in 1933: 'Famous Funnies'."
  },
  drama: {
    why: "Drama delves into realistic characters, conflicts, and emotional intensity.",
    bestFor: ["Deep thinkers", "Emotionally driven readers", "Theatre and film lovers"],
    trivia: "Greek tragedy and Shakespearean plays were the foundation of dramatic storytelling."
  }
};


  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [suggested, setSuggested] = useState([])
  const [additionalInfo, setAdditionalInfo] = useState(null)
  // 📝 Dummy reviews state
  const [reviews, setReviews] = useState([
  ])

  // 📝 New review input state
 const [newReview, setNewReview] = useState({
  rating: 5,
  reviewMessage: ''
})


  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`https://bookapp-2nn8.onrender.com/api/book/specificbook/${id}`)
        if (response.data) {
          setReviews(response.data.reviews)
          setBook(response.data)
          // Fetch suggested books by same subject
          const sugRes = await axios.get(`https://bookapp-2nn8.onrender.com/api/book/all`)
          if (sugRes.data && Array.isArray(sugRes.data)) {
            setSuggested(
              sugRes.data
                .filter(
                  b =>
                    b.subject === response.data.subject &&
                    b._id !== response.data._id
                )
                .slice(0, 8)
            )
          }
          if(token){
          const checkList=await axios.get(`https://bookapp-2nn8.onrender.com/api/book/checklist/${id}`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          if(checkList.data.message=="Book already in readlist"){
            setAdded(true)
          }
          
        }}
         const info = genreInfoMap[response.data.subject];
  setAdditionalInfo(info || null)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
        
      }
       
      
    }
    fetchBook()
    
  }, [id])

  const handleAddToReadlist = async() => {
    
    if(!token){
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please log in to add book to readlist.',
      })
      return
    }
    setAdded(true)
    try {
      await axios.post(`https://bookapp-2nn8.onrender.com/api/book/readlist/${id}`,{},{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 📥 Handle input change for review form
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }))
  }
const handleDeleteReview=async(bid,rid)=>{
  
  try {
    await axios.delete(`https://bookapp-2nn8.onrender.com/api/book/review/${bid}/${rid}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setReviews(prev => prev.filter(review => review._id !== rid))
  } catch (error) {
    console.log(error)
  }
}
  // 📤 Handle review submission
  const handleSubmitReview = async(e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    Swal.fire({
      icon: 'warning',
      title: 'Not Logged In',
      text: 'Please log in to submit a review.',
      confirmButtonColor: '#28a745',
    });
    return;
  }
const token = localStorage.getItem('token');
  const { _id, name } = user;

  if (newReview.reviewMessage.trim() === '') {
    Swal.fire({
      icon: 'error',
      title: 'Empty Review',
      text: 'Please write something in your review.',
      confirmButtonColor: '#28a745',
    });
    return;
  }

  // Add new review to state
  
  try{
    const res=await axios.post(`https://bookapp-2nn8.onrender.com/api/book/review/${id}`, {
      userid: _id,
      name: name,
      rating: parseInt(newReview.rating),
      comment: newReview.reviewMessage
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if(res.data){
            setReviews(prev => [...prev, res.data]); // res.data is the new review

    }
    
  }
  catch(error)
  {
    console.log(error);
  }
  // Reset form
  setNewReview({
    rating: 5,
    comment: ''
  });

  Swal.fire({
    icon: 'success',
    title: 'Review Submitted',
    text: 'Your review has been added.',
    confirmButtonColor: '#28a745',
  });
  
 
};


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh', background: '#181c1f' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading book...</span>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center" style={{ color: '#28a745', background: '#181c1f', minHeight: '60vh', paddingTop: 60 }}>
        Book not found.
      </div>
    )
  }

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
        <div className="row justify-content-center">
          <div className="col-12 col-lg-11">
            <div
              className="card shadow mb-4"
              style={{
                width: '100%',
                
                borderRadius: 18,
                background: '#23272b',
                color: '#fff',
                padding: '2rem 2rem 1.5rem 2rem',
                
              }}
            >
              
              <div className="row">
                <div className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      style={{
                        width: 200,
                        height: 300,
                        objectFit: 'cover',
                        borderRadius: 12,
                        boxShadow: '0 2px 12px #28a74533',
                        background: '#181c1f',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 200,
                        height: 300,
                        background: 'linear-gradient(135deg, #28a74533 0%, #00000011 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#28a745',
                        borderRadius: 12,
                        fontWeight: 600,
                        fontSize: 22,
                        letterSpacing: 1,
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  <h2 className="mb-2" style={{ color: '#28a745', fontWeight: 700 }}>
                    {book.title}
                  </h2>
                  <div className="mb-3" style={{ color: '#bdbdbd', fontSize: 16 }}>
                    <strong>Author(s):</strong> {book.authors?.join(', ') || 'Unknown'}
                  </div>
                <div className="mb-2">
  {additionalInfo && (
    <div className="additional-info-container">
      <div className="additional-info-card">
        

        <div className="info-block">
          <h5>📘 Why Read It?</h5>
          <p>{additionalInfo.why}</p>
        </div>

        <div className="info-block">
          <h5>✅ Best For</h5>
          {Array.isArray(additionalInfo.bestFor) ? (
            <ul>
              {additionalInfo.bestFor.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{additionalInfo.bestFor}</p>
          )}
        </div>

        <div className="info-block">
          <h5>🎯 Trivia</h5>
          <p>{additionalInfo.trivia}</p>
        </div>
      </div>
    </div>
  )}
</div>

                  <div className="mb-2">
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
                  <div className="mb-3" style={{ color: '#bdbdbd', fontSize: 15, minHeight: 60 }}>
                    <strong>Summary:</strong>
                    <div style={{ marginTop: 4 }}>
                      {book.summary || 'No summary available.'}
                    </div>
                  </div>
                  
                  <button
                    className="btn w-100 mb-3"
                    style={{
                      background: added ? '#bdbdbd' : '#28a745',
                      color: '#fff',
                      fontWeight: 600,
                      borderRadius: 8,
                      marginTop: 8,
                      cursor: added ? 'not-allowed' : 'pointer',
                    }}
                    onClick={handleAddToReadlist}
                    disabled={added}
                  >
                    {added ? 'Added to Readlist' : 'Add to Readlist'}
                  </button>
                Find on:
                  <div className="d-flex gap-2 mt-3">
                    
  <button
     style={{
      background: '#3c69ffff',
      color: 'white',
      fontWeight: 600,
      textAlign: 'center',
      borderRadius: 8,
      border: 'none',
       padding: '5px 8px',
    display: 'flex',
    alignItems: 'center',
    }}
    onClick={() => window.open(`https://www.flipkart.com/search?q=${book.title}`, '_blank')}
  >
    Flipkart
   
  </button>

  <button
   
    style={{
      background: '#FF9900',
      color: 'black',
      fontWeight: 600,
      textAlign: 'center',
      borderRadius: 8,
      border: 'none',
       padding: '5px 8px',
    display: 'flex',
    alignItems: 'center',
    }}
    onClick={() => window.open(`https://www.amazon.in/s?k=${book.title}`, '_blank')}
  >
    Amazon
   
  </button>

  <button
    style={{
       background: '#ff9e74',         
    color: 'black',
    fontWeight: 600,
    textAlign: 'center',
    borderRadius: 8,
    border: 'none',
    padding: '5px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
    }}
    onClick={() => window.open(`https://www.goodreads.com/search?q=${book.title}`, '_blank')}
  >
   Good Reads
   
  </button>
</div>

                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ✍️ Add Review Form */}
            <div
              className="card shadow p-3"
              style={{
                background: '#23272b',
                color: '#fff',
                borderRadius: 12,
                width: '86%',
                margin: '0 auto',
              }}
            >
              <h5 style={{ color: '#28a745', fontWeight: 600 }}>Write a Review</h5>
              <form onSubmit={handleSubmitReview}>
                
                <div className="mb-2">
                  <select
                    name="rating"
                    value={newReview.rating}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ background: '#181c1f', color: '#fff', border: '1px solid #28a745' }}
                  >
                    <option value="5">⭐️⭐️⭐️⭐️⭐️ (5)</option>
                    <option value="4">⭐️⭐️⭐️⭐️ (4)</option>
                    <option value="3">⭐️⭐️⭐️ (3)</option>
                    <option value="2">⭐️⭐️ (2)</option>
                    <option value="1">⭐️ (1)</option>
                  </select>
                </div>
                <div className="mb-2">
                  <textarea
                    name="reviewMessage"
                    placeholder="Write your review..."
                    value={newReview.comment}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                    style={{ background: '#181c1f', color: '#fff', border: '1px solid #28a745' }}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{ width: '100%', fontWeight: 600 }}
                  
                >
                  Submit Review
                </button>
              </form>
            </div>
        {/* 📝 Reviews Section */}
        <div className="row justify-content-center mt-4">
          <div className="col-12 col-lg-10">
            <h4 className="mb-3" style={{ color: '#28a745', fontWeight: 600 }}>
              Reviews
            </h4>
            <div className="mb-4">
              {reviews.length === 0 ? (
                <div className="mb-3" style={{ color: '#28a745', fontSize: 16 }}>
                  No reviews yet.
                </div>
              ) : (
                reviews.slice().reverse().map((review, index) => (
                  <div
                    key={index}
                    className=""
                    style={{
                      display: 'flex',
                      gap: 12,
                      background: '#23272b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      padding: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                    <div style={{ fontWeight: 600, color: '#28a745', marginBottom: '0.5rem' }}>
                      {
                        dispUser&&dispUser===review.name
                        ?("You")
                        :(review.name)
                      }
                      <div>
  <span style={{
    fontSize: 14,
    color: '#bdbdbd',
  }}>
    {new Date(review.createdAT).toLocaleDateString()}
  </span>
</div>

                      
                    </div>
                    
                    <div style={{ color: '#bdbdbd', marginBottom: '0.5rem' }}>
                      {"⭐".repeat(review.rating)}{"☆".repeat(5 - review.rating)}{' '}
                      <span style={{ fontSize: 14, marginLeft: 6 }}>({review.rating}/5)</span>
                    </div>
                    <div style={{ color: '#ccc', fontSize: 15 }}>
                      {review.comment || 'No review available.'}
                    </div>
                    </div>
                     <div style={{ marginLeft: 'auto' }}>
              {
                dispUser&&dispUser===review.name
                ?(
                  <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteReview(book._id,review._id)}
                >
                  Delete
                </button>
                )
                :null
              }
            </div>
                  </div>
                ))
              )}
              
            </div>

           
          </div>
        </div>

        {/* You may also like section */}
        <div className="row justify-content-center mt-5" onClick={() => window.location.reload()}>
          

          <div className="col-12 col-lg-10">
            <h4 className="mb-3" style={{ color: '#28a745', fontWeight: 600 }}>
              You may also like
            </h4>
            <div className="row g-3">
              {suggested.length === 0 ? (
                <div className="text-muted" style={{ color: '#bdbdbd', fontSize: 16 }}>
                  No similar books found.
                </div>
              ) : (
                suggested.map(sug => (
                  <div key={sug._id} className="col-6 col-md-3 d-flex">
                    <Link
                      to={`/book/${sug._id}`}
                      className="card shadow text-decoration-none"
                      style={{
                        background: '#23272b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 12,
                        width: '100%',
                        minHeight: 260,
                        transition: 'box-shadow 0.2s',
                      }}
                    >
                      {sug.coverImage ? (
                        <img
                          src={sug.coverImage}
                          alt={sug.title}
                          style={{
                            width: '100%',
                            height: 140,
                            objectFit: 'cover',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: 140,
                            background: 'linear-gradient(135deg, #28a74533 0%, #00000011 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#28a745',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            fontWeight: 600,
                            fontSize: 16,
                          }}
                        >
                          No Image
                        </div>
                      )}
                      <div className="card-body p-2">
                        <div style={{ color: '#28a745', fontWeight: 600, fontSize: 15 }}>
                          {sug.title}
                        </div>
                        <div style={{ color: '#bdbdbd', fontSize: 13 }}>
                          {sug.authors?.join(', ') || 'Unknown'}
                        </div>
                        <span
                          className="Text-align-center mt-1"
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
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecificBook
