import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Impact from './components/Impact';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Trigger scroll-reveal animations
  useScrollReveal();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        <Hero />
        <Impact />
        <Timeline />
        <Projects />
        <Skills />
        
        <div className="divider">
          <hr />
        </div>
        
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
