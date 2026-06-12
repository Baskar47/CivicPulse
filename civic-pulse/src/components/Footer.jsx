import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Security', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Resources: ['Documentation', 'API', 'Community', 'Support'],
    Legal: ['Privacy', 'Terms', 'Cookies', 'License'],
  };

  const socials = [
    { icon: Twitter, label: 'Twitter' },
    { icon: Github, label: 'GitHub' },
    { icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--ink)' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '64px 24px' }}>
        {/* Top Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
            gap: '48px',
            marginBottom: '48px',
            paddingBottom: '48px',
            borderBottom: '1px solid var(--rule)',
          }}
        >
          {/* Brand */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--accent)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '900',
                  fontSize: '16px',
                }}
              >
                CP
              </div>
              <span className="display" style={{ fontWeight: '900', fontSize: '18px', color: 'var(--ink)' }}>
                Civic<span style={{ color: 'var(--accent)' }}>Pulse</span>
              </span>
            </div>
            <p style={{ color: 'var(--ink-2)', marginBottom: '24px', maxWidth: '300px', lineHeight: '1.6' }}>
              Empowering communities to drive real change through transparent civic engagement.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-2)' }}>
                <Mail size={18} />
                <span>hello@civicpulse.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-2)' }}>
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-2)' }}>
                <MapPin size={18} />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '16px', color: 'var(--ink)' }}>
              Stay Updated
            </h3>
            <p style={{ color: 'var(--ink-2)', marginBottom: '16px' }}>
              Get the latest updates on community improvements and platform features.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--rule)',
                  borderRadius: '6px',
                  color: 'var(--ink)',
                  fontSize: '14px',
                  fontFamily: "'Nunito Sans', sans-serif",
                  outline: 'none',
                  transition: 'all 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--rule)')}
              />
              <button
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => (e.target.style.filter = 'brightness(1.1)')}
                onMouseLeave={(e) => (e.target.style.filter = 'brightness(1)')}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        {/* Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: '32px',
            marginBottom: '48px',
            paddingBottom: '48px',
            borderBottom: '1px solid var(--rule)',
          }}
        >
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h4 style={{ fontWeight: '700', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-3)', marginBottom: '16px' }}>
                {category}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        color: 'var(--ink-2)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.target.style.color = 'var(--ink)')}
                      onMouseLeave={(e) => (e.target.style.color = 'var(--ink-2)')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <p style={{ color: 'var(--ink-3)', fontSize: '13px' }}>© 2024 Civic Pulse. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {socials.map((social, idx) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ scale: 1.2 }}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--rule)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--ink-2)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                    e.currentTarget.style.color = 'var(--ink-2)';
                  }}
                  title={social.label}
                >
                  <Icon size={20} />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
