import { Suspense, lazy, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CanvasGuard from './components/CanvasGuard';

const ParticleField = lazy(() => import('./components/ParticleField'));

function App() {
  const [heroCovering, setHeroCovering] = useState(true);

  useEffect(() => {
    const handleAnchor = () => {
      const hash = window.location.hash;
      if (!hash) return;
      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // malformed escape sequence — use the raw hash
      }
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
    handleAnchor();
    window.addEventListener('hashchange', handleAnchor);
    return () => window.removeEventListener('hashchange', handleAnchor);
  }, []);

  // The hero's opaque Beams canvas hides the particle field, so pause it
  // while the hero still covers most of the viewport.
  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroCovering(entry.intersectionRatio > 0.9),
      { threshold: [0.85, 0.95] }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-dark text-light">
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
          <CanvasGuard>
            <Suspense fallback={null}>
              <ParticleField paused={heroCovering} />
            </Suspense>
          </CanvasGuard>
        </div>

        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Services />
            <Portfolio />
            <Skills />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
