import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


function HiveBot() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChatIndex, setSelectedChatIndex] = useState(-1);
  const [chatId, setChatId] = useState(null);
  const [dummyHistory, setDummyHistory] = useState([]);
  const chatContainerRef = useRef(null);
  const [newMsg,setNewMSg]=useState(false);
  // Dummy chat history
 

  useEffect(() => {
    if (!token) navigate('/signin');

    const checkHistory = async () => {
      try{
      const res = await axios.get('https://bookapp-2nn8.onrender.com/api/hivebot/checkhistory', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.history) {
        console.log(res.data.history);
        setDummyHistory(res.data.history);
      }
    }
    catch(err)
    {
      console.error('HiveBot API Error:', err);
    }
    };

    checkHistory();
    
  }, [token, navigate, newMsg]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [chat]);
useEffect(() => {
  console.log("Updated chatId:");
}, [chatId]);
  const handleAsk = async () => {
    const prompt = userInput.trim();
    if (!prompt) return;

    const newChat = [...chat, { type: 'user', message: prompt }];
    setChat(newChat);
    setUserInput('');
    setLoading(true);

    try {
      const res = await axios.post('https://bookapp-2nn8.onrender.com/api/hivebot/askquestion', { prompt, chatId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
       if(res.data.chatId&&chatId===null){
        setChatId(res.data.chatId);
        setSelectedChatIndex(dummyHistory.length);
        newMsg?setNewMSg(false):setNewMSg(true);
       }
      const chunks = res.data.reply.split(/(?<=[.?!])\s+/);
      let currentMessage = '';
      let index = 0;
      
      
      const interval = setInterval(() => {
        if (index >= chunks.length) {
          clearInterval(interval);
          setLoading(false);
          return;
        } 

        currentMessage += chunks[index] + ' ';
        const updatedChat = [...newChat, { type: 'bot', message: currentMessage.trim() }];
        setChat(updatedChat);
       
        index++;
      }
      
      , 100);

    } catch (err) {
      console.error('HiveBot API Error:', err);
      setChat([...newChat, { type: 'bot', message: '❌ Error connecting to HiveBot. Please try again later.' }]);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleAsk();
    }
  };

  const handleHistoryClick = (index) => {
     setChat(dummyHistory[index].messages);
  setSelectedChatIndex(index);
  setChatId(dummyHistory[index].chatId);
  };

  return (
    <div className="d-flex flex-column flex-md-row bg-dark text-white min-vh-100 p-2 p-md-3 gap-3">

      {/* Sidebar */}
     {/* For Large Screens (Sidebar Vertical) */}
<div
  className="bg-black p-3 rounded shadow d-none d-sm-block"
  style={{ width: '250px', marginRight: '1rem', height: '90vh', overflowY: 'auto' }}
>
  <div className="text-center fw-bold mb-3 fs-5">🕘 Chat History</div>

  <div
    className="mb-2 rounded bg-dark text-light"
    style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', padding: '10px' }}
    onClick={() => {
      setChat([]);
      setChatId(null);
       setSelectedChatIndex(-1)
       
    }}
  >
    ➕ New Chat
  </div>

  {dummyHistory.map((item, index) => (
    <div
      key={index}
      className={`p-2 mb-2 rounded ${selectedChatIndex === index ? 'bg-secondary text-white' : 'bg-dark text-light'}`}
      onClick={() => handleHistoryClick(index)}
      style={{ cursor: 'pointer' }}
    >
      {item.title}
    </div>
  ))}
</div>

{/* For Small Screens (Horizontal Scrollable Titles) */}
<div className="bg-black p-2 rounded shadow d-block d-sm-none mb-3">
  <div className="fw-bold text-light mb-2">🕘 Chat History</div>

  <div
    className="mb-2 rounded bg-dark text-light text-center"
    style={{ cursor: 'pointer', padding: '8px' }}
    onClick={() => {
      setChat([]);
      setChatId(null);
      setSelectedChatIndex(-1)
    }}
  >
    ➕ New Chat
  </div>

  <div style={{ display: 'flex', overflowX: 'auto', gap: '8px' }}>
    {dummyHistory.map((item, index) => (
      <div
        key={index}
        className={`p-2 rounded flex-shrink-0 ${selectedChatIndex === index ? 'bg-secondary text-white' : 'bg-dark text-light'}`}
        onClick={() => handleHistoryClick(index)}
        style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        {item.title}
      </div>
    ))}
  </div>
</div>


      {/* Main Chat Window */}
      <div className="card bg-secondary text-white flex-grow-1 shadow" style={{ height: '90vh' ,width:'100%'}}>
        <div className="card-header bg-dark text-center fs-4 fw-bold border-bottom-0">
          🤖 HiveBot — Your Book Assistant
        </div>

        <div
          className="card-body overflow-auto px-4 custom-scrollbar"
          ref={chatContainerRef}
          style={{ backgroundColor: '#101214', maxHeight: '70vh' }}
        >
          {chat.length === 0 && !loading ? (
            <div className="text-center mt-5">
              <div style={{ fontSize: '70px' }}>🤖</div>
              <div className="fs-5 mt-3">
                💬 Ask about authors, books, genres, recommendations...<br />
                📚 Discover hidden gems and must-reads.<br />
                ✍️ Learn about your favorite writers and their works.<br />
                🧠 Get personalized reading suggestions instantly!<br />
                🔍 Curious about a book? Just type your question and explore!
              </div>
            </div>
          ) : (
            chat.map((msg, index) => (
              <div
                key={index}
                className={`d-flex mb-3 ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div className="d-flex align-items-end">
                  {msg.type === 'bot' && (
                    <div className="me-2">
                      <span className="bg-warning text-dark rounded-circle d-inline-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px', fontWeight: 'bold' }}>
                        🤖
                      </span>
                    </div>
                  )}
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: msg.type === 'user' ? '#28a745' : '#212529',
                      color: 'white',
                      maxWidth: '70%', 
                      width: 'fit-content',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      borderRadius: '20px'
                    }}
                  >
                    {msg.type === 'bot' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.message}
                      </ReactMarkdown>
                    ) : (
                      msg.message
                    )}
                  </div>
                  {msg.type === 'user' && (
                    <div className="ms-2">
                      <span className="bg-info text-dark rounded-circle d-inline-flex justify-content-center align-items-center" style={{ width: '35px', height: '35px', fontWeight: 'bold' }}>
                        ☺️
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="d-flex justify-content-start mb-3">
              <div className="bg-dark p-3 rounded text-white d-flex align-items-center">
                <div className="spinner-border text-light spinner-border-sm me-2" role="status" />
                HiveBot is thinking...
              </div>
            </div>
          )}
        </div>

        <div className="card-footer bg-dark border-top-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-lg bg-light border-0"
              placeholder="Ask about books..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              style={{ borderRadius: '0.5rem 0 0 0.5rem' }}
            />
            <button
              className="btn btn-success btn-lg"
              onClick={handleAsk}
              disabled={loading}
              style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
            >
              {loading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #101214;
        }
      `}</style>
    </div>
  );
}

export default HiveBot;
