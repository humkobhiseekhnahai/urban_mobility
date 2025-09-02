import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import logo from '../../assets/UPLYFT.svg';

const Footer = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const companyInfo = {
    name: 'UPLYFT',
    // address: 'SRM University, Kattankulathur, Tamil Nadu, India',
    address: 'IIIT Kalyani,West Bengal, India',
    email: 'contact@uplyft.com',
    phone: '+91 123 456 7890',
  };

  const socialLinks = [
    { icon: <FaTwitter />, href: '#' },
    { icon: <FaLinkedin />, href: '#' },
    { icon: <FaInstagram />, href: '#' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      console.log('Subscribed with email:', email);
    }
  };

  return (
    <motion.footer
      className="relative overflow-hidden border-t border-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Brand Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src={logo} alt="UPLYFT Logo" className="-mt-8 h-22 w-22 object-contain mb-1"/>
            <p className="text-white text-sm leading-relaxed">
              Empowering businesses through innovative solutions and cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="text-white hover:opacity-80 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold uppercase text-sm tracking-wider">Contact</h3>
            <div className="space-y-4 text-white text-sm">
              <div className="flex items-start space-x-3">
                <FiMapPin className="flex-shrink-0 mt-1" />
                <p>{companyInfo.address}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail />
                <a href={`mailto:${companyInfo.email}`} className="hover:opacity-80 transition-opacity">
                  {companyInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone />
                <a href={`tel:${companyInfo.phone}`} className="hover:opacity-80 transition-opacity">
                  {companyInfo.phone}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-white font-semibold uppercase text-sm tracking-wider">Newsletter</h3>
            <AnimatePresence>
              {!isSubscribed ? (
                <motion.form 
                  className="space-y-4" 
                  onSubmit={handleSubmit}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <motion.button
                    type="submit"
                    className="w-full py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-blue-500 font-medium"
                >
                  Thank you for subscribing!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="mt-16 pt-8 border-t border-white/10 text-center text-white/80 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p>
            © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
            <span className="mx-2">|</span>
            <a href="/privacy" className="hover:opacity-80 transition-opacity">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
