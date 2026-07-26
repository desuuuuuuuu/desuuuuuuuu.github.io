import { motion } from 'framer-motion';
import { SiHtml5, SiCss, SiJavascript, SiTailwindcss, SiSharp, SiPython, SiNodedotjs, SiReact } from 'react-icons/si';
import SectionHeading from './SectionHeading';
import { portfolioData } from '../data/portfolio';

const skillIcons = {
  SiHtml5: SiHtml5,
  SiCss: SiCss,
  SiJavascript: SiJavascript,
  SiTailwindcss: SiTailwindcss,
  SiSharp: SiSharp,
  SiPython: SiPython,
  SiNodedotjs: SiNodedotjs,
  SiReact: SiReact
};

const Skills = () => {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          title="My"
          accent="Skills"
          subtitle="The technologies I work with every day."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {portfolioData.skills.map((skill, index) => {
            const Icon = skillIcons[skill.icon];
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="bg-dark-3/90 rounded-xl p-6 flex flex-col items-center gap-3 border border-cream/10 hover:border-cream/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-cream/5 transition-all duration-300 group text-center"
              >
                {Icon && (
                  <Icon className="text-3xl text-cream group-hover:text-cream-light group-hover:scale-110 transition-all duration-300" />
                )}
                <div>
                  <h3 className="text-light text-sm font-semibold">{skill.name}</h3>
                  <p className="text-muted text-xs mt-1.5 leading-relaxed">{skill.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
