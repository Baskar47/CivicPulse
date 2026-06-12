import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, TrendingUp, Shield, Zap, MessageSquare } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: 'Easy Reporting',
      description: 'Submit issues with photos and details in seconds. Track your complaint status in real-time.',
    },
    {
      icon: Users,
      title: 'Community Engagement',
      description: 'Connect with neighbors, vote on priorities, and see how your voice impacts real change.',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'View comprehensive data on resolved issues, response times, and community impact metrics.',
    },
    {
      icon: Shield,
      title: 'Transparent Process',
      description: 'Complete transparency with detailed tracking and updates from start to resolution.',
    },
    {
      icon: Zap,
      title: 'Fast Turnaround',
      description: 'Quick response times from local government with priority handling systems.',
    },
    {
      icon: MessageSquare,
      title: '24/7 Support',
      description: 'Round-the-clock support team ready to help you navigate the platform.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50/50 dark:bg-slate-900/50 relative">
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            Why Civic Pulse
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Powerful Features for <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Real Impact</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Everything you need to make a difference in your community.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                className="group p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
