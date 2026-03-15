import React from 'react';

function About() {
  return (
    <div style={{ backgroundColor: '#181c1f', color: '#f4f4f4', minHeight: '100vh' }} className="py-5 px-3">
      <div className="container py-5">
        <h1 className="text-center mb-5 fw-bold" style={{ color: '#ffffff' }}>About BookHive</h1>

        <p className="fs-5 mb-4">
          Welcome to <span style={{ color: '#facc15', fontWeight: '600' }}>BookHive</span> — your ultimate destination for discovering, sharing, and exchanging books with fellow readers across the globe. Whether you're hunting for a hidden gem or trying to pass along a story that moved you, BookHive is built just for book lovers like you.
        </p>

        <p className="fs-5 mb-4">
          Our mission is to connect readers and help build a thriving community around the joy of books. We believe every book deserves a reader and every reader deserves access to great stories.
        </p>

        <p className="fs-5 mb-4">
          Built by passionate developers and bibliophiles, BookHive makes it easy to search for titles, review your favorite reads, and connect with sellers or donors nearby.
        </p>

        <p className="fs-5">
          Thank you for being part of this journey. Let's spread the love of books — one read at a time.
        </p>
      </div>
    </div>
  );
}

export default About;
