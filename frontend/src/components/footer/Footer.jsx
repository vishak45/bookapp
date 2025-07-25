import React from 'react'

function Footer() {
  return (
    <footer
      className="text-white text-center py-3 mt-auto"
      style={{
        width: '100%',
        left: 0,
        bottom: 0,
        position: 'relative',
        background: '#181c1f',
        borderTop: '4px solid #28a745',
      }}
    >
      <div className="container-fluid py-1">
        <span>&copy; {new Date().getFullYear()} BookHive. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default Footer