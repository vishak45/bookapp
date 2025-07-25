import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct import


import Footer from './components/footer/Footer';
import Home from './components/Home';
import Header from './components/header/Header';
import SearchBook from './components/searchBook/SearchBook';
import SpecificBook from './components/specificBook/SpecificBook';
import Login from './components/signup/Login';
import Register from './components/signup/Register';
import FilterBooks from './components/filterbooks/FilterBooks';
import ReadList from './components/readlist/ReadList';
import SearchRecommend from './components/searchrecommend/SearchRecommend';
import ReviewFilter from './components/reviewfilter/ReviewFilter';
import UpdatePass from './components/updatepass/UpdatePass';
import About from './components/aboutus/About';
import HiveBot from './components/hivebot/HiveBot';
function TokenHandler() {
  

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          
        }
      } catch (error) {
        
        localStorage.removeItem('token');
        
      }
    }
  }, []);

  return null;
}

function App() {
  return (
    <Router>
      <TokenHandler />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:key" element={<SearchBook />} />
        <Route path="/book/:id" element={<SpecificBook />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/filter" element={<FilterBooks />} />
        <Route path="/searchrecommend" element={<SearchRecommend />} />
        <Route path="/readlist" element={<ReadList />} />
        <Route path="/reviews" element={<ReviewFilter />} />
        <Route path="/updatepass" element={<UpdatePass />} />
        <Route path="/about" element={<About />} />
        <Route path="/hivebot" element={<HiveBot />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
