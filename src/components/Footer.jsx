import { useState, useEffect } from 'react';

const Footer = () => {
  const [latency, setLatency] = useState('32ms');

  useEffect(() => {
    const interval = setInterval(() => {
      const newLatency = (28 + Math.floor(Math.random() * 30)) + 'ms';
      setLatency(newLatency);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <h3>FELIXVIEW</h3>
            <p>Frontend Developer with additional expertise in System Analysis, Networking, and Cybersecurity, dedicated to building responsive, secure, and user-friendly web experiences.</p>
          </div>

          <div className="footer__links-grid">
            <div className="footer__nav">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#skills">Skills</a></li>
              </ul>
            </div>

            <div className="footer__socials-col">
              <h4>Connect</h4>
              <ul className="footer__socials-list">
                <li>
                  <a href="https://github.com/issakafelix" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/in/issakafelix" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com/@issakafelix" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.5 3.96-1.82 5.36-1.52 1.59-3.9 2.03-6.02 1.34-2.19-.68-3.79-2.61-4.08-4.88-.32-2.6.93-5.26 3.19-6.44 1.41-.74 3.14-.85 4.67-.34v4.06c-.66-.35-1.45-.44-2.18-.21-.77.24-1.39.87-1.61 1.65-.24.84.05 1.79.74 2.34.69.56 1.68.64 2.51.2.82-.42 1.32-1.28 1.32-2.2V.02z"/></svg>
                    TikTok
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__status-box">
              <h4>System Status</h4>
              <div className="footer__status-grid">
                <div className="status-card">
                  <div className="status-card__dot status-card__dot--online"></div>
                  <div className="status-card__info">
                    <div className="status-card__label">Portfolio</div>
                  </div>
                  <div className="status-card__value">Online</div>
                </div>
                <div className="status-card">
                  <div className="status-card__dot status-card__dot--online"></div>
                  <div className="status-card__info">
                    <div className="status-card__label">API Latency</div>
                  </div>
                  <div className="status-card__value">{latency}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Issaka Felix. All Rights Reserved.</p>
          <div className="footer__bottom-links">
            <a href="mailto:issakafelix57@gmail.com">issakafelix57@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
