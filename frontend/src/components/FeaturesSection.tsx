"use client";

import React from "react";

const FeaturesSection: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16 md:mt-24">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-10">
        Why Choose ChatHub?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            Secure
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Your conversations are private and secure. We don't store any chat data.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            Simple
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            No registration required. Just create a room and start chatting instantly.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02] duration-300">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            Fast
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Real-time messaging with instant delivery. No delays or lag.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
