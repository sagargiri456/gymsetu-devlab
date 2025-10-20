"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  const baseShadow = darkMode
    ? "bg-[#2b2b2b] shadow-[8px_8px_16px_rgba(0,0,0,0.3),_-8px_-8px_16px_rgba(255,255,255,0.1)]"
    : "bg-[#e0e5ec] shadow-[8px_8px_16px_rgba(0,0,0,0.15),_-8px_-8px_16px_rgba(255,255,255,0.7)]";

  const insetShadow =
    "hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-[#2b2b2b] text-gray-100" : "bg-[#e0e5ec] text-gray-800"
      } flex flex-col items-center`}
    >
      {/* === Theme Toggle === */}
      <div className="w-full flex justify-end p-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${baseShadow}`}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* === Hero Section === */}
      <section className="text-center py-20 px-4 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6"
        >
          Welcome to <span className="text-blue-500">GymSetu</span>
        </motion.h1>
        <p className="text-lg mb-10 opacity-80">
          Your all-in-one gym management platform — manage workouts, track progress, and
          connect with your fitness community effortlessly.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`px-8 py-3 text-lg font-medium rounded-2xl transition-all duration-300 ${baseShadow} ${insetShadow}`}
        >
          Get Started
        </motion.button>
      </section>

      {/* === Features Section === */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8 py-20 max-w-6xl">
        {[
          {
            title: "Smart Scheduling",
            desc: "Manage classes, trainers, and sessions seamlessly with intelligent scheduling tools.",
          },
          {
            title: "Member Management",
            desc: "Track memberships, renewals, and performance insights all in one dashboard.",
          },
          {
            title: "Automated Billing",
            desc: "Simplify payment collection with auto-billing and invoice tracking.",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className={`p-8 rounded-2xl text-center transition-all duration-300 ${baseShadow}`}
          >
            <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
            <p className="opacity-80">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* === Contest Section === */}
      <section className="py-20 px-8 text-center max-w-5xl">
        <h2 className="text-3xl font-bold mb-8">
          🏋️‍♂️ Join the <span className="text-blue-500">GymSetu Challenge!</span>
        </h2>
        <p className="mb-10 opacity-80 max-w-2xl mx-auto">
          Participate in exciting monthly fitness contests! Log your workouts, compete
          with fellow gym-goers, and win amazing prizes. Show your strength, earn rewards,
          and stay motivated.
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-8 rounded-2xl max-w-xl mx-auto transition-all duration-300 ${baseShadow}`}
        >
          <h3 className="text-2xl font-semibold mb-4">🏆 October Fitness Contest</h3>
          <p className="opacity-80 mb-6">
            Complete 20 workout sessions this month to enter the prize pool and stand a
            chance to win GymSetu merchandise and premium subscriptions.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-2xl text-lg font-medium transition-all duration-300 ${baseShadow} ${insetShadow}`}
          >
            Participate Now
          </motion.button>
        </motion.div>
      </section>

      {/* === Testimonials Section === */}
      <section className="py-20 px-8 text-center max-w-5xl">
        <h2 className="text-3xl font-bold mb-10">What Our Members Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            {
              quote:
                "GymSetu made managing my workouts so easy. The challenges keep me motivated every month!",
              author: "– Riya, Fitness Enthusiast",
            },
            {
              quote:
                "I love the Neumorphic design and simplicity. Plus, I actually won a prize in last month's challenge!",
              author: "– Arjun, Gym Member",
            },
          ].map((t, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`p-8 rounded-2xl text-left transition-all duration-300 ${baseShadow}`}
            >
              <p className="italic mb-4 opacity-80">{t.quote}</p>
              <p className="font-semibold">{t.author}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === CTA Footer === */}
      <footer className="py-20 px-8 text-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${baseShadow} ${insetShadow}`}
        >
          Start Your Free Trial with GymSetu
        </motion.button>
        <p className="mt-6 opacity-70 text-sm">
          © {new Date().getFullYear()} GymSetu. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
