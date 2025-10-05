import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
const Footer = () => {
  return (
    <footer className="text-gray-300 bg-gray-900">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">BookHaven</h3>
            <p className="text-sm">
              Your one-stop destination for all things books.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="text-sm hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-sm hover:text-white">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/admin/login" className="text-sm hover:text-white">
                  Admin Login
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/fiction" className="text-sm hover:text-white">
                  Fiction
                </a>
              </li>
              <li>
                <a href="/non-fiction" className="text-sm hover:text-white">
                  Non-Fiction
                </a>
              </li>
              <li>
                <a href="/children" className="text-sm hover:text-white">
                  Children's Books
                </a>
              </li>
              <li>
                <a href="/academic" className="text-sm hover:text-white">
                  Academic
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              <a href="/" className="hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="/" className="hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="/" className="hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 mt-8 text-sm text-center border-t border-gray-800">
          <p>&copy; 2025 BookHaven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;