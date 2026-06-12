import React from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    { number: '10K+', label: 'Active Citizens' },
    { number: '500+', label: 'Issues Resolved' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24h', label: 'Avg Response Time' },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-white/20">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                {stat.number}
              </motion.div>
              <div className="text-sm md:text-base font-semibold text-blue-100 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
