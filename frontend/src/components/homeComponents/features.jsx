import React from 'react';
import { motion } from 'framer-motion';
import { features } from '../../constants';

const Features = () => {
  return (
    <motion.div
      className="relative mt-20 min-h-[600px]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* <motion.span
          className="bg-[#1a1a2e] text-[#3b82f6] rounded-full h-6 text-sm font-medium px-2 py-1 uppercase"
          whileHover={{ scale: 1.05 }}
        >
          Feature
        </motion.span> */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
          Seamlessly Optimize{' '}
          <span className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-transparent bg-clip-text">
            Your Route
          </span>
        </h2>
      </motion.div>

      <div className="flex flex-wrap mt-10 lg:mt-20">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="w-full sm:w-1/2 lg:w-1/3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex mx-4"
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="flex mx-6 h-10 w-10 p-2 bg-[#1a1a2e] text-[#3b82f6] justify-center items-center rounded-full"
                whileHover={{ scale: 1.1, backgroundColor: '#1e3a8a' }}
              >
                {feature.icon}
              </motion.div>
              <div>
                <h5 className="mt-1 mb-6 text-xl">{feature.text}</h5>
                <p className="text-md p-2 mb-20 text-[#e0e0ff]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Features;