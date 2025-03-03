import React from 'react';
import { motion } from 'framer-motion';
import { resourcesLinks, platformLinks, communityLinks } from '../../constants';

const Footer = () => {
  return (
    <motion.footer
      className="mt-20 border-t py-10 border-[#1a1a2e]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {[
          { title: 'Resources', links: resourcesLinks },
          { title: 'Platform', links: platformLinks },
          { title: 'Community', links: communityLinks },
        ].map((section, sIndex) => (
          <motion.div
            key={sIndex}
            className="px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: sIndex * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-md font-semibold mb-4"
              whileHover={{ color: '#3b82f6' }}
            >
              {section.title}
            </motion.h3>
            <ul className="space-y-2">
              {section.links.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.2 * sIndex }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href={link.href}
                    className="text-[#e0e0ff] hover:text-[#3b82f6]"
                    whileHover={{ x: 3, color: '#3b82f6' }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {link.text}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="pt-6 mt-6 border-t border-[#1a1a2e] text-center text-[#e0e0ff] text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
      >
        <p>© {new Date().getFullYear()} UPLYFT, All rights reserved.</p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;