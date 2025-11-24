import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">BookInn Hub</h3>
            <p className="text-gray-400 text-sm mt-1">Luxury and comfort in the heart of the city.</p>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com/Skywalker690" className="text-gray-400 hover:text-white transition">Terms of Service</a>
            <a href="https://github.com/Skywalker690" className="text-gray-400 hover:text-white transition">Contact Us</a>
            <a href="https://github.com/Skywalker690" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} BookInn Hub Management System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;