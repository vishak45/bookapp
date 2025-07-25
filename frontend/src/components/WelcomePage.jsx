import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import img1 from "../assets/pics/community.webp";
import img2 from "../assets/pics/find books near you.webp";
import img3 from "../assets/pics/trade and discover.webp";
import "./WelcomePage.css"; // We’ll move your styles here

function WelcomePage() {
    const token = localStorage.getItem('token');
  useEffect(() => {
    const swiper = new Swiper(".mySwiper", {
      loop: true,
      autoplay: {
        delay: 3000, // 3 seconds per slide
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }, []);

  return (
    <div className="swiper-parent">
      <div className="swiper mySwiper">
        <div className="swiper-wrapper">
          {/* Slide 1 */}
          <div className="swiper-slide">
            <img
              src={img1}
              alt="New Stories"
            />
            <div className="text-overlay">
              <h1>Discover New Stories</h1>
              <p>Explore a world of books waiting to be rediscovered.</p>
              <Link to="/filter" className="btn">
                Start Exploring
              </Link>
            </div>
          </div>
          {/* Slide 2 */}
          <div className="swiper-slide">
            <img
              src={img2}
              alt="Trade Books"
            />
            <div className="text-overlay">
              <h1>Share Your Reviews</h1>
              <p>Share your book reviews with the world.</p>
              <Link to="/filter" className="btn">
                Share Now
              </Link>
             
            </div>
          </div>
          {/* Slide 3 */}
          <div className="swiper-slide">
            <img
              src={img3}
              alt="Community"
            />
            <div className="text-overlay">
              <h1>HiveBot</h1>
              <p>Chat with our HiveBot.</p>
              <Link to="/hivebot" className="btn">
                Chat Now
              </Link>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="swiper-pagination"></div>

        {/* Navigation buttons */}
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    </div>
  );
}

export default WelcomePage;
