import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import CanvasGuard from './CanvasGuard';
import SpecularButton from './SpecularButton';
import DiscordPresence from './DiscordPresence';
import { portfolioData } from '../data/portfolio';

const Beams = lazy(() => import('./Beams'));

const socialIcons = {
  FaGithub: FaGithub
};

const Hero = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(true);

  // Halt the Beams render loop entirely while the hero is scrolled out of view
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 h-full" aria-hidden="true">
        <CanvasGuard>
          <Suspense fallback={null}>
            <Beams
              beamWidth={2}
              beamHeight={15}
              beamNumber={12}
              lightColor="#E4E4E7"
              speed={2}
              noiseIntensity={1.75}
              scale={0.2}
              rotation={0}
              paused={!inView}
            />
          </Suspense>
        </CanvasGuard>
      </div>

      {portfolioData.heroBackgroundImage && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src={portfolioData.heroBackgroundImage}
            alt=""
            decoding="async"
            style={{ opacity: 'var(--portrait-opacity, 0.15)' }}
            className="w-full h-full object-contain object-center grayscale [mask-image:radial-gradient(ellipse_70%_65%_at_center,black_35%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_70%_65%_at_center,black_35%,transparent_78%)]"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/60 to-dark pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-28 pb-24 md:pt-32 md:pb-28">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-shrink-0 relative"
          >
            <div className="absolute inset-0 rounded-full bg-silver/15 blur-3xl scale-90" aria-hidden="true" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
              className="absolute -inset-4 rounded-full border border-dashed border-silver/25"
              aria-hidden="true"
            />
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-[3px] border-silver/40 shadow-2xl shadow-silver/10">
              <img
                src={portfolioData.profileImage}
                alt={portfolioData.brand}
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 max-w-xl text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-silver/25 bg-silver/5 mb-6">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-silver opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-silver" />
              </span>
              <span className="text-silver/90 text-xs uppercase tracking-[0.2em] font-medium">
                {portfolioData.availability}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 bg-gradient-to-b from-white via-[#C9C9CE] to-[#77777E] bg-clip-text text-transparent">
              {portfolioData.brand}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-silver/90 mb-10 leading-relaxed">
              {portfolioData.tagline}
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 mb-10">
              <SpecularButton
                size="md"
                radius={18}
                tint="#E4E4E7"
                tintOpacity={0.1}
                blur={2}
                textColor="#f5f5f5"
                lineColor="#E4E4E7"
                baseColor="#E4E4E7"
                intensity={1}
                shineSize={10}
                shineFade={40}
                thickness={1}
                speed={0.35}
                followMouse
                proximity={250}
                autoAnimate={false}
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View My Work
              </SpecularButton>
              <a
                href="#contact"
                className="px-8 py-3.5 rounded-2xl border border-light/20 text-light/80 text-base font-medium hover:border-silver/50 hover:text-silver transition-colors duration-300"
              >
                Get in Touch
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-4 pt-6 border-t border-light/10">
              <DiscordPresence />
              {portfolioData.socials.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-light/60 hover:text-silver transition-colors duration-300 group"
                    aria-label={social.name}
                  >
                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-sm">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-light/40 hover:text-silver transition-colors duration-300 z-10"
        aria-label="Scroll to About section"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.svg
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.a>
    </section>
  );
};

export default Hero;
