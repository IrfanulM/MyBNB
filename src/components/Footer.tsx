import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Irfanul Majumder</p>
        <div className="footer-links">
          <a href="https://github.com/IrfanulM">GitHub</a>
          <span>|</span>
          <a href="https://www.linkedin.com/in/irfanul-majumder">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;