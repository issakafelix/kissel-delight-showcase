import { useState, useEffect } from 'react';

const Navbar = ({ toggleTheme, theme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#hero" className="navbar__logo">FELIXVIEW</a>

        <div className="navbar__right">
          <ul className={`navbar__links ${isMobileNavOpen ? 'open' : ''}`} id="nav-menu">
            <li><a href="#about" onClick={closeMobileNav}>About</a></li>
            <li><a href="#experience" onClick={closeMobileNav}>Experience</a></li>
            <li><a href="#projects" onClick={closeMobileNav}>Projects</a></li>
            <li><a href="#skills" onClick={closeMobileNav}>Skills</a></li>
            <li><a href="#contact" onClick={closeMobileNav}>Contact</a></li>
          </ul>

          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span id="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>

          <div 
            className={`navbar__hamburger ${isMobileNavOpen ? 'open' : ''}`} 
            onClick={() => setMobileNavOpen(!isMobileNavOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
