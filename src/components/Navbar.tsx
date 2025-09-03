import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const topSection = document.querySelector('.top-section') as HTMLElement | null;

    if (!topSection) return;

    const topSectionHeight = topSection.offsetHeight;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < topSectionHeight) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${!visible ? 'hidden' : ''}`}>
      <div className="navbar-container">
        <Link href="/" passHref>
          <div className="navbar-logo" style={{ cursor: 'pointer' }}>
            <Image src="/icon-text.svg" alt="MyBNB Logo" width={120} height={40} />
          </div>
        </Link>
        <div className="navbar-profile">
          <button className="profile-button">Profile</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;