"use client";

import React from "react";

const FeaturesSection: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-20 md:mt-28">
      <h2 className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-16">
        Why Choose ChatHub?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 - Secure */}
        <div className="group backdrop-blur-xl bg-white/30 dark:bg-slate-800/30 rounded-3xl shadow-xl border border-white/40 dark:border-slate-700/40 p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 to-teal-500/8 dark:from-emerald-400/10 dark:to-teal-400/10 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
              Secure
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              Your conversations are private and secure. We don't store any chat data on our servers.
            </p>
          </div>
        </div>

        {/* Feature 2 - Simple */}
        <div className="group backdrop-blur-xl bg-white/30 dark:bg-slate-800/30 rounded-3xl shadow-xl border border-white/40 dark:border-slate-700/40 p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 to-cyan-500/8 dark:from-blue-400/10 dark:to-cyan-400/10 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4">
              Simple
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              No registration required. Just create a room and start chatting instantly with anyone.
            </p>
          </div>
        </div>

        {/* Feature 3 - Fast */}
        <div className="group backdrop-blur-xl bg-white/30 dark:bg-slate-800/30 rounded-3xl shadow-xl border border-white/40 dark:border-slate-700/40 p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 to-pink-500/8 dark:from-violet-400/10 dark:to-pink-400/10 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 dark:from-violet-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
              Fast
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              Real-time messaging with instant delivery. No delays, no lag, just pure communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
