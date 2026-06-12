import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import Button from './Button';

const ModernNavbar = ({ isDark, onThemeToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ['Features', 'How It Works', 'About', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '60px',
          }}
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
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
            <span
              className="display"
              style={{
                fontWeight: '900',
                fontSize: '18px',
                color: 'var(--ink)',
                display: window.innerWidth < 640 ? 'none' : 'inline',
              }}
            >
              Civic<span style={{ color: 'var(--accent)' }}>Pulse</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div
            style={{
              display: window.innerWidth < 768 ? 'none' : 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {navItems.map((item, idx) => (
              <motion.a
                key={idx}
                href={`#${item.toLowerCase()}`}
                style={{
                  padding: '8px 14px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  color: 'var(--ink-2)',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
                whileHover={{ backgroundColor: 'var(--bg-inset)', color: 'var(--ink)' }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onThemeToggle}
              className="theme-btn"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-inset)',
                border: '1.5px solid var(--rule)',
                color: 'var(--ink-2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* CTA Button */}
            <Button
              variant="primary"
              size="sm"
              style={{ display: window.innerWidth < 640 ? 'none' : 'inline-flex' }}
            >
              Sign In
            </Button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsOpen(!isOpen)}
              style={{
                display: window.innerWidth < 768 ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ink)',
              }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
          style={{
            display: window.innerWidth < 768 ? 'block' : 'none',
            borderTop: '1px solid var(--rule)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item, idx) => (
              <motion.a
                key={idx}
                href={`#${item.toLowerCase()}`}
                style={{
                  padding: '8px 14px',
                  color: 'var(--ink-2)',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-inset)';
                  e.target.style.color = 'var(--ink)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--ink-2)';
                }}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </motion.a>
            ))}
            <Button variant="primary" size="md">
              Sign In
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default ModernNavbar;
