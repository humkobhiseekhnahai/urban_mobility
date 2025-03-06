import React from 'react';
import { motion } from 'framer-motion';
import { founders } from '../../constants';

const AboutUs = () => {
  return (
    <motion.div 
      className="py-20 px-4 bg-neutral-900 border-t border-neutral-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-5xl lg:text-6xl mb-4 tracking-wide text-neutral-100">
            Building the Future of{' '}
            <span className="bg-gradient-to-r from-neutral-100 to-neutral-300 text-transparent bg-clip-text">
              Mobility
            </span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            A passionate team dedicated to revolutionizing transportation through innovative technology
          </p>
        </motion.div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {founders.map((founder, index) => (
            <motion.div
              key={index}
              className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.05)' }}
            >
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-neutral-600 mb-4">
                  <motion.img
                    className="w-full h-full object-cover"
                    src={founder.image}
                    alt={founder.name}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <h3 className="text-xl font-medium text-neutral-100 mb-1">
                  {founder.name}
                </h3>
                <p className="text-sm text-neutral-400 mb-4">{founder.role}</p>
                <p className="text-neutral-300 text-center text-sm leading-relaxed">
                  {founder.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AboutUs;