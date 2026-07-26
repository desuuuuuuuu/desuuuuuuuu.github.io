import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { portfolioData } from '../data/portfolio';

const stats = [
  { value: `${portfolioData.projects.length}+`, label: 'Projects Built' },
  { value: `${portfolioData.skills.length}+`, label: 'Technologies' },
  { value: `${portfolioData.services.length}`, label: 'Services Offered' }
];

const About = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-dark-2/60">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading title="About" accent="Me" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-wrap justify-center gap-2.5 mb-8">
            {portfolioData.highlights.map((highlight) => (
              <span
                key={highlight}
                className="px-4 py-1.5 text-xs rounded-full bg-silver/10 text-silver border border-silver/20 uppercase tracking-wider"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="text-light/80 text-base leading-relaxed space-y-5">
            {portfolioData.bio.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-silver/10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-silver text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-muted text-xs md:text-sm mt-1.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-silver/10 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 text-center sm:text-left">
            <span className="text-muted text-sm font-medium">Email</span>
            <a
              href={`mailto:${portfolioData.email}`}
              className="text-silver hover:text-silver-light transition-colors text-sm break-all"
            >
              {portfolioData.email}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
