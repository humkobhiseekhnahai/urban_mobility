import React from 'react';
import { motion } from 'framer-motion';
import { testimonials } from '../../constants';

const Testimonials = () => {
  // Duplicate testimonials for seamless looping
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <motion.div
      className="mt-20 tracking-wide overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20 text-neutral-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        What People are saying
      </motion.h2>

      <div className="relative h-[600px] overflow-hidden">
        <motion.div
          className="flex absolute top-0 left-0"
          animate={{
            x: ['0%', '-50%'], // Matches the duplicated content
          }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="w-[80vw] sm:w-[50vw] lg:w-[30vw] px-4 py-2 flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-neutral-900 rounded-md p-6 text-md border border-neutral-700 font-thin h-full"
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.p className="text-neutral-300">
                  {testimonial.text}
                </motion.p>
                <motion.div className="flex mt-8 items-start">
                  <motion.img
                    className="w-12 h-12 mr-6 rounded-full border border-neutral-600"
                    src={testimonial.image}
                    alt=""
                    whileHover={{ 
                      scale: 1.1, 
                      borderColor: '#e5e5e5',
                      boxShadow: '0 0 15px rgba(229, 229, 229, 0.2)'
                    }}
                  />
                  <div>
                    <h6 className="text-neutral-100 font-medium">{testimonial.user}</h6>
                    <span className="text-sm font-normal italic text-neutral-400">
                      {testimonial.company}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Testimonials;
