import { motion } from 'framer-motion';

const SectionHeading = ({ title, accent, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5 }}
    className="text-center mb-12 md:mb-16"
  >
    <h2 className="text-3xl md:text-4xl font-bold text-light tracking-tight">
      {title}{' '}
      <span className="bg-gradient-to-b from-white via-[#C9C9CE] to-[#77777E] bg-clip-text text-transparent">
        {accent}
      </span>
    </h2>
    {subtitle && (
      <p className="text-muted text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
    <div className="w-24 h-px bg-gradient-to-r from-transparent via-silver to-transparent mx-auto mt-5" />
  </motion.div>
);

export default SectionHeading;
