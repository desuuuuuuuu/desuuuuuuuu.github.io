import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaEnvelope } from 'react-icons/fa';
import SectionHeading from './SectionHeading';
import SpecularButton from './SpecularButton';
import { portfolioData } from '../data/portfolio';

const socialIcons = {
  FaGithub: FaGithub
};

const inputClass =
  'w-full px-4 py-3 bg-dark/80 border border-cream/20 rounded-lg text-light text-sm ' +
  'placeholder:text-light/30 focus:outline-none focus:border-cream focus:ring-1 focus:ring-cream/30 transition-colors';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${portfolioData.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-dark-2/60">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          title="Get in"
          accent="Touch"
          subtitle="Have a project in mind or just want to say hi? Feel free to reach out."
        />

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 flex flex-col gap-5"
          >
            <div className="bg-dark-3/90 rounded-xl p-6 border border-cream/10">
              <h3 className="text-light font-semibold mb-2">Let&apos;s build something</h3>
              <p className="text-light/60 text-sm leading-relaxed">
                I&apos;m open to freelance projects, collaborations, and full-time opportunities.
                The fastest way to reach me is by email.
              </p>
            </div>

            <a
              href={`mailto:${portfolioData.email}`}
              className="bg-dark-3/90 rounded-xl p-6 border border-cream/10 hover:border-cream/30 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-1.5">
                <FaEnvelope className="text-cream" aria-hidden="true" />
                <span className="text-light/70 text-xs uppercase tracking-wider font-medium">Email</span>
              </div>
              <span className="text-cream group-hover:text-cream-light transition-colors text-sm break-all">
                {portfolioData.email}
              </span>
            </a>

            <div className="bg-dark-3/90 rounded-xl p-6 border border-cream/10">
              <p className="text-light/70 text-xs uppercase tracking-wider font-medium mb-3">Follow me</p>
              <div className="flex gap-4">
                {portfolioData.socials.map((social) => {
                  const Icon = socialIcons[social.icon];
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-cream/10 border border-cream/20 flex items-center justify-center text-cream hover:bg-cream/20 hover:text-cream-light transition-colors"
                      aria-label={social.name}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-dark-3/90 rounded-xl p-6 md:p-8 border border-cream/10 space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-light/70 text-xs mb-2 font-medium uppercase tracking-wider">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-light/70 text-xs mb-2 font-medium uppercase tracking-wider">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-light/70 text-xs mb-2 font-medium uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Your message..."
                />
              </div>
              <div className="pt-1">
                <SpecularButton
                  size="md"
                  radius={14}
                  tint="#EFE6D0"
                  tintOpacity={0.1}
                  blur={2}
                  textColor="#f5f5f5"
                  lineColor="#EFE6D0"
                  baseColor="#EFE6D0"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  type="submit"
                >
                  Send Message
                </SpecularButton>
                <p className="text-muted text-xs mt-3">Opens your email app with the message pre-filled.</p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
