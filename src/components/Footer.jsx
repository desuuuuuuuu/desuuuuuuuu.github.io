import { motion } from 'framer-motion';
import { FaGithub, FaArrowUp } from 'react-icons/fa';
import { portfolioData } from '../data/portfolio';

const socialIcons = {
  FaGithub: FaGithub
};

const Footer = () => {
  return (
    <footer className="bg-dark-3/90 border-t border-silver/10 pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/images/logo.svg" alt="Desu Wannabisaya logo" className="w-8 h-8" />
              <h3 className="text-silver text-base font-bold">{portfolioData.brand}</h3>
            </div>
            <p className="text-muted text-xs leading-relaxed max-w-xs">
              Full-Stack Web & Mobile Developer & IT Specialist, creating modern and responsive web experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h4 className="text-light font-semibold mb-4 text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {portfolioData.navLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-muted hover:text-silver transition-colors text-xs">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h4 className="text-light font-semibold mb-4 text-xs uppercase tracking-wider">Connect With Me</h4>
            <div className="flex gap-3">
              {portfolioData.socials.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-silver/10 border border-silver/20 flex items-center justify-center text-muted hover:text-silver hover:bg-silver/15 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="pt-6 border-t border-silver/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted text-[11px]">
            &copy; {new Date().getFullYear()} {portfolioData.brand} | All Rights Reserved
          </p>
          <a
            href="#home"
            className="flex items-center gap-2 text-muted hover:text-silver transition-colors text-[11px] uppercase tracking-wider"
          >
            Back to top <FaArrowUp size={10} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
