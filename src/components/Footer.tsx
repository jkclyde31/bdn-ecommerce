import React from 'react';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-green-900 text-gray-300 mt-[50px] md:mt-[100px]">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="space-y-4 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3">
            <div className="w-15 h-15 bg-white rounded-full flex items-center justify-center">
              <Image src="/bdn-logo.png" alt="BDN Inc. Logo" width={80} height={80} />
            </div>
            <span className="text-white text-xl font-bold">BDN Inc.</span>
          </div>
          <p className="text-sm text-center md:text-left">Your one-stop shop for quality products</p>
        </div>

        {/* Products Links */}
        <div className="text-center md:text-left">
          <h3 className="text-white font-semibold text-lg mb-4">Products</h3>
          <ul className="space-y-3">
            <li>
              <a href="/browse" className="hover:text-white transition-colors">Browse Products</a>
            </li>
            <li>
              <a href="/featured" className="hover:text-white transition-colors">Featured Products</a>
            </li>
            <li>
              <a href="/new" className="hover:text-white transition-colors">New Products</a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="text-center md:text-left">
          <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 justify-center md:justify-start">
              <Mail size={18} />
              <a href="mailto:bdn@estore.com" className="hover:text-white transition-colors">
                bdn@estore.com
              </a>
            </li>
            <li className="flex items-center gap-2 justify-center md:justify-start">
              <Phone size={18} />
              <a href="tel:+09124566789" className="hover:text-white transition-colors">
                0912-456-6789
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="text-center md:text-left">
          <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
          <div className="flex gap-4 justify-center md:justify-start">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="mailto:bdn@estore.com"
              className="hover:text-white transition-colors"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-400">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
          <p>&copy; {currentYear} BDN Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;