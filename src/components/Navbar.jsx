import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../data/portfolio';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const toggleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Highlight the nav link of the section currently in view
  useEffect(() => {
    const sections = portfolioData.navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile menu is open; Escape closes it
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  const linkClass = (href) =>
    `relative uppercase tracking-[0.15em] font-medium transition-colors duration-300 ` +
    `after:absolute after:left-0 after:-bottom-1.5 after:h-px after:bg-silver after:transition-all after:duration-300 ` +
    (active === href
      ? 'text-silver after:w-full'
      : 'text-light/70 hover:text-silver after:w-0 hover:after:w-full');

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark/90 backdrop-blur-md shadow-lg shadow-black/30 border-b border-silver/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          <img src="/images/logo.svg" alt="Desu Wannabisaya logo" className="w-9 h-9 md:w-10 md:h-10" />
          <span className="text-lg md:text-xl font-bold tracking-wider bg-gradient-to-b from-white via-[#C9C9CE] to-[#77777E] bg-clip-text text-transparent">Desu Wannabisaya</span>
        </a>

        <div className="hidden md:flex items-center gap-7 lg:gap-9">
          {portfolioData.navLinks.map((link) => (
            <a key={link.href} href={link.href} className={`text-xs lg:text-sm ${linkClass(link.href)}`}>
              {link.label}
            </a>
          ))}
        </div>

        <button
          ref={toggleRef}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-light flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className={`block w-6 h-[2px] bg-current rounded transition-transform ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-current rounded transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-current rounded transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-dark-2/95 backdrop-blur-md border-t border-silver/10 overflow-hidden"
          >
            <div className="flex flex-col items-center py-8 gap-6 max-h-[calc(100dvh-4rem)] overflow-y-auto">
              {portfolioData.navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm ${linkClass(link.href)}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
