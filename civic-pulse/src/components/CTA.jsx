import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '80px 24px', backgroundColor: 'var(--bg-inset)' }}>
      <motion.div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2
          className="display"
          style={{
            fontSize: '42px',
            fontWeight: '900',
            color: 'var(--ink)',
            marginBottom: '24px',
          }}
        >
          Ready to Make a Difference?
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: 'var(--ink-2)',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px',
            lineHeight: '1.6',
          }}
        >
          Join thousands of citizens who are already using Civic Pulse to improve their communities. Your voice matters. Your actions matter.
        </p>
        <motion.div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
          whileHover={{ scale: 1.02 }}
        >
          <Button onClick={() => navigate('/login')} variant="primary" size="lg">
            Get Started Now
            <ArrowRight size={20} />
          </Button>
          <Button variant="outline" size="lg">
            Schedule Demo
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTA;
