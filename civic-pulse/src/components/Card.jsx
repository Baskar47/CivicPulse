import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  delay = 0,
  ...props
}) => {
  const variants = {
    default: 'card',
    inset: 'card-inset',
    ruled: 'card-ruled',
  };

  return (
    <motion.div
      className={clsx(variants[variant], 'p-6', hover && 'cursor-pointer', className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={hover ? { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
