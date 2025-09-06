import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { listingsApi } from '../services/api';

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = document.cookie.split(';').some((item) => item.trim().startsWith('token='));
      setIsLoggedIn(token);
    };

    checkAuthStatus();

    // Re-check auth status on route change
    router.events.on('routeChangeComplete', checkAuthStatus);

    const topSection = document.querySelector('.top-section') as HTMLElement | null;
    if (!topSection) return;
    const topSectionHeight = topSection.offsetHeight;

    const handleScroll = () => {
      setVisible(window.scrollY < topSectionHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      router.events.off('routeChangeComplete', checkAuthStatus);
    };
  }, [router.events]);

  const handleSignOut = async () => {
    try {
      await listingsApi.signout();
      setIsLoggedIn(false);
      router.push('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <nav className={`navbar ${!visible ? 'hidden' : ''}`}>
      <div className="navbar-container">
        <Link href="/" passHref>
          <div className="navbar-logo" style={{ cursor: 'pointer' }}>
            <Image src="/icon-text.svg" alt="MyBNB Logo" width={120} height={40} />
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