import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { portfolioData } from '../data/portfolio';

const ProjectCard = ({ project, index }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const prev = () => setCurrentImage((p) => (p === 0 ? project.images.length - 1 : p - 1));
  const next = () => setCurrentImage((p) => (p === project.images.length - 1 ? 0 : p + 1));

  const hiddenFeatures = project.features.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-dark-3/90 rounded-xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 flex flex-col"
    >
      <div className="relative group">
        <div className="aspect-video overflow-hidden bg-dark-2">
          {imageFailed ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-2 to-dark-3">
              <span className="text-gold/40 text-4xl font-bold">{project.title.charAt(0)}</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={project.images[currentImage]}
                alt={`${project.title} screenshot ${currentImage + 1} of ${project.images.length}`}
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          )}
        </div>

        {!imageFailed && project.images.length > 1 && (
          <>
            <div className="absolute inset-0 flex items-center justify-between px-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity duration-300">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full bg-dark/80 text-light flex items-center justify-center hover:bg-gold/80 transition-colors text-sm"
                aria-label="Previous image"
              >
                &#10094;
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full bg-dark/80 text-light flex items-center justify-center hover:bg-gold/80 transition-colors text-sm"
                aria-label="Next image"
              >
                &#10095;
              </button>
            </div>
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {project.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImage ? 'bg-gold w-4' : 'bg-light/30 w-1.5 hover:bg-light/50'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === currentImage ? 'true' : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gold mb-2">{project.title}</h3>
        <p className="text-light/60 text-sm leading-relaxed mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-[11px] rounded-full bg-gold/10 text-gold border border-gold/20"
            >
              {tech}
            </span>
          ))}
        </div>

        <ul className="space-y-1.5 mt-auto">
          {project.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="text-light/50 text-xs flex items-start gap-2">
              <span className="text-gold flex-shrink-0" aria-hidden="true">&#8226;</span>
              {feature}
            </li>
          ))}
          {hiddenFeatures > 0 && (
            <li className="text-gold/60 text-xs pt-0.5">+ {hiddenFeatures} more features</li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 md:py-28 bg-dark-2/60">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          title="My"
          accent="Projects"
          subtitle="A selection of projects that showcase my skills in web and mobile development."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
