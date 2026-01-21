import React, { useState, useEffect, useRef } from 'react';
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const dropdownRef = useRef(null);

  // 1. Listen for Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setShowAuthModal(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAuthModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showAuthModal]);

  // 3. Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container">
      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowAuthModal(false)}>&times;</button>
            {isLoginView ? (
              <Login onSwitch={() => setIsLoginView(false)} />
            ) : (
              <Signup onSwitch={() => setIsLoginView(true)} />
            )}
          </div>
        </div>
      )}

      {/* NAVIGATION BAR */}
      <nav className="navbar">
        <div className="logo-text">IP-BRIDGE</div>
        
        <div className="auth-section">
          {user ? (
            <div className="profile-container" ref={dropdownRef}>
              <div className="avatar" onClick={() => setShowDropdown(!showDropdown)}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="profile" />
                ) : (
                  (user.displayName?.[0] || user.email?.[0]).toUpperCase()
                )}
              </div>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="user-name">{user.displayName || 'Inventor'}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <hr />
                  <button className="logout-btn" onClick={() => signOut(auth)}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-trigger-btn" onClick={() => setShowAuthModal(true)}>
              Sign In
            </button>
          )}
        </div>
      </nav>

      <header className="hero-section">
        <h1>IP-BRIDGE</h1>
        <p>Turning Dusty Patents into Future Products</p>
      </header>

      <main className="content">
        {user ? (
          <UploadPage />
        ) : (
          <div className="lock-screen">
            <h3>Ready to rescue a patent?</h3>
            <p>Sign in to access the AI transformation tools.</p>
            <button 
              className="btn-primary start-btn" 
              onClick={() => setShowAuthModal(true)}
            >
              Get Started
            </button>
          </div>
        )}
        
        <section className="gallery-section">
          <GalleryPage />
        </section>
      </main>
    </div>
  );
}

export default App;