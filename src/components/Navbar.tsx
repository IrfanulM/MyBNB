import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { listingsApi } from '../services/api';
import Logo from './Logo';

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const checkAuthStatus = useCallback(async () => {
    const { isAuthenticated } = await listingsApi.getAuthStatus();
    setIsLoggedIn(isAuthenticated);
  }, []);

  useEffect(() => {
    checkAuthStatus();

    router.events.on('routeChangeComplete', checkAuthStatus);

    const handleScroll = () => {
      const topSection = document.querySelector('.top-section') as HTMLElement | null;
      
      if (topSection) {
        setVisible(window.scrollY < topSection.offsetHeight);
      } else {
        setVisible(window.scrollY < 50);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      router.events.off('routeChangeComplete', checkAuthStatus);
    };
  }, [router.events, checkAuthStatus]);

  const handleSignOut = async () => {
    try {
      await listingsApi.signout();
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <nav className={`navbar ${!visible ? 'hidden' : ''}`}>
      <div className="navbar-container">
        <Link href="/" passHref>
          <div className="navbar-logo">
            <Logo className="logo" />
          </div>
        </Link>
        <div className="navbar-links">
          {isLoggedIn ? (
            <>
              <Link href="/profile" passHref>
                <button className="profile-button">Profile</button>
              </Link>
              <button onClick={handleSignOut} className="profile-button-secondary">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/signin" passHref>
                <button className="profile-button">Sign In</button>
              </Link>
              <Link href="/signup" passHref>
                <button className="profile-button-secondary">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;