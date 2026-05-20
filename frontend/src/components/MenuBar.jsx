import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function MenuBar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className="position-fixed top-0 start-0 m-3 btn btn-link"
        style={{ zIndex: 100 }}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div style={{ width: '25px' }}>
          <span 
            style={{ 
              display: 'block', 
              height: '3px', 
              background: '#ef4444', 
              margin: '5px 0',
              borderRadius: '2px',
              transition: 'transform 0.3s, opacity 0.3s',
              transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              opacity: isOpen ? 0 : 1
            }}
          ></span>
          <span 
            style={{ 
              display: 'block', 
              height: '3px', 
              background: '#ef4444', 
              margin: '5px 0',
              borderRadius: '2px',
              transition: 'transform 0.3s',
              transform: isOpen ? 'rotate(-45deg)' : 'none'
            }}
          ></span>
          <span 
            style={{ 
              display: 'block', 
              height: '3px', 
              background: '#ef4444', 
              margin: '5px 0',
              borderRadius: '2px',
              transition: 'transform 0.3s',
              transform: isOpen ? 'rotate(-45deg) translate(-5px, -5px)' : 'none'
            }}
          ></span>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 99, background: 'rgba(0,0,0,0.5)' }}
          onClick={closeMenu}
        ></div>
      )}

      {/* Sidebar Menu */}
      <div 
        className="position-fixed top-0 start-0 h-100 glass"
        style={{ 
          width: isOpen ? '70%' : '0', 
          maxWidth: '300px',
          zIndex: 101,
          transition: 'width 0.3s ease',
          overflow: 'hidden'
        }}
      >
        <div className="p-4" style={{ width: '300px' }}>
          {/* Close Button */}
          <div className="d-flex justify-content-end mb-4">
            <button 
              className="btn btn-link text-light"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <i className="bi bi-x-lg fs-5"></i>
            </button>
          </div>

          {/* Menu Items */}
          <div className="d-flex flex-column gap-2">
            <Link 
              to="/" 
              className={`p-3 rounded text-decoration-none ${isActive('/') ? 'border-l-4 border-red-500 bg-gray-700/50' : 'text-light'}`}
              style={{ 
                borderLeft: isActive('/') ? '4px solid #ef4444' : 'none',
                background: isActive('/') ? 'rgba(55, 65, 81, 0.5)' : 'transparent'
              }}
              onClick={closeMenu}
            >
              <i className="bi bi-house me-2"></i>
              Get Start
            </Link>
            <Link 
              to="/editing" 
              className={`p-3 rounded text-decoration-none ${isActive('/editing') ? 'border-l-4 border-red-500 bg-gray-700/50' : 'text-light'}`}
              style={{ 
                borderLeft: isActive('/editing') ? '4px solid #ef4444' : 'none',
                background: isActive('/editing') ? 'rgba(55, 65, 81, 0.5)' : 'transparent'
              }}
              onClick={closeMenu}
            >
              <i className="bi bi-pencil me-2"></i>
              Editing
            </Link>
            <Link 
              to="/render" 
              className={`p-3 rounded text-decoration-none ${isActive('/render') ? 'border-l-4 border-red-500 bg-gray-700/50' : 'text-light'}`}
              style={{ 
                borderLeft: isActive('/render') ? '4px solid #ef4444' : 'none',
                background: isActive('/render') ? 'rgba(55, 65, 81, 0.5)' : 'transparent'
              }}
              onClick={closeMenu}
            >
              <i className="bi bi-play-circle me-2"></i>
              Render
            </Link>
            <Link 
              to="/about" 
              className={`p-3 rounded text-decoration-none ${isActive('/about') ? 'border-l-4 border-red-500 bg-gray-700/50' : 'text-light'}`}
              style={{ 
                borderLeft: isActive('/about') ? '4px solid #ef4444' : 'none',
                background: isActive('/about') ? 'rgba(55, 65, 81, 0.5)' : 'transparent'
              }}
              onClick={closeMenu}
            >
              <i className="bi bi-info-circle me-2"></i>
              About
            </Link>
          </div>
        </div>
      </div>

      {/* FAB Button (Mobile) */}
      <div className="mobile-visible desktop-hidden">
        <button className="fab-button" onClick={() => window.location.href = '/editing'}>
          <i className="bi bi-camera-reels fs-4"></i>
        </button>
      </div>
    </>
  )
}

export default MenuBar