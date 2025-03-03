import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { pricingOptions } from '../../constants';

const Cards = () => {
  return (
    <motion.div
      className="mt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span className="bg-gradient-to-r from-neutral-100 to-neutral-300 text-transparent bg-clip-text">
          Get Started
        </span>
      </motion.h2>

      <div className="flex flex-wrap">
        {pricingOptions.map((option, index) => (
          <motion.div
            key={index}
            className="w-full sm:w-1/2 lg:w-1/3 p-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="p-10 border border-neutral-700 rounded-xl h-full bg-neutral-900"
              whileHover={{
                y: -10,
                boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.1)',
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <p className="text-4xl mb-8 text-neutral-100">
                {option.title}
                {option.title === 'Pro' && (
                  <motion.span
                    className="bg-gradient-to-r from-neutral-200 to-neutral-400 text-transparent bg-clip-text text-xl mb-4 ml-2"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    (Most Popular)
                  </motion.span>
                )}
              </p>
              <ul>
                {option.features.map((feature, fIndex) => (
                  <motion.li
                    key={fIndex}
                    className="mt-8 flex items-center text-neutral-300"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: fIndex * 0.05 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="text-neutral-300"
                    >
                      <CheckCircle2 />
                    </motion.div>
                    <span className="ml-2">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.a
                href="#"
                className="inline-flex justify-center items-center text-center w-full h-12 p-5 mt-20 tracking-tight text-xl text-neutral-100 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition duration-200"
                whileHover={{
                  scale: 1.03,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.a>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Cards;
