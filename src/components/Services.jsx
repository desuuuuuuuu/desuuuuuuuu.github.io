import { motion } from 'framer-motion';
import { FaCode, FaPaintBrush, FaLaptopCode, FaMobileAlt, FaDatabase, FaDesktop } from 'react-icons/fa';
import SectionHeading from './SectionHeading';
import { portfolioData } from '../data/portfolio';

const serviceIcons = {
  FaCode: FaCode,
  FaPaintBrush: FaPaintBrush,
  FaLaptopCode: FaLaptopCode,
  FaMobileAlt: FaMobileAlt,
  FaDatabase: FaDatabase,
  FaDesktop: FaDesktop
};

const ServiceCard = ({ service, index }) => {
  const Icon = serviceIcons[service.icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-dark-3/90 rounded-xl p-7 border border-silver/10 hover:border-silver/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-silver/5 transition-all duration-300 group flex flex-col"
    >
      {Icon && (
        <div className="w-12 h-12 rounded-lg bg-silver/10 border border-silver/20 flex items-center justify-center mb-5 group-hover:bg-silver/15 transition-colors">
          <Icon className="text-xl text-silver group-hover:text-silver-light transition-colors" />
        </div>
      )}
      {service.subtitle && (
        <p className="text-muted text-xs uppercase tracking-[0.15em] mb-1.5">{service.subtitle}</p>
      )}
      <h3 className="text-lg font-semibold text-silver mb-3 group-hover:text-silver-light transition-colors">
        {service.title}
      </h3>
      <p className="text-light/60 text-sm leading-relaxed mb-5 flex-1">
        {service.description}
      </p>
      <ul className="space-y-2 border-t border-silver/10 pt-4">
        {service.features.map((feature, i) => (
          <li key={i} className="text-light/50 text-sm flex items-start gap-2.5">
            <span className="text-silver mt-1 flex-shrink-0 text-xs" aria-hidden="true">&#8226;</span>
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          title="My"
          accent="Services"
          subtitle="Traditional, modern and advanced solutions for the web, mobile, and desktop."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
