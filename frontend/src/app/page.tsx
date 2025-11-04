"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFacebook, 
  faPinterest, 
  faYoutube, 
  faGithub 
} from "@fortawesome/free-brands-svg-icons";
import { isAuthenticated, verifyToken } from "@/lib/auth";

export default function LandingPage() {
  const router = useRouter();
  // Initialize to false to match server render (prevents hydration mismatch)
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize dark mode on mount and sync with document
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      const shouldBeDark = saved === 'true' || document.documentElement.classList.contains('dark');
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setDarkMode(false);
      }
    }
  }, []);

  // Check if user is already logged in and redirect to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const isValid = await verifyToken();
        if (isValid) {
          router.push("/dashboard");
        }
      }
    };
    checkAuth();
  }, [router]);

  // Prevent hydration mismatch by using default styles until mounted
  const baseShadow = (!mounted || !darkMode)
    ? "bg-[#e0e5ec] shadow-[8px_8px_16px_rgba(0,0,0,0.15),_-8px_-8px_16px_rgba(255,255,255,0.7)]"
    : "bg-[#2b2b2b] shadow-[8px_8px_16px_rgba(0,0,0,0.3),_-8px_-8px_16px_rgba(255,255,255,0.1)]";

  const insetShadow =
    "hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]";

  const bgColor = (!mounted || !darkMode)
    ? "bg-[#e0e5ec] text-gray-800"
    : "bg-[#2b2b2b] text-gray-100";

  const buttonText = (!mounted || !darkMode) ? "🌙 Dark Mode" : "☀️ Light Mode";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${bgColor} flex flex-col items-center`}
    >
      {/* === Theme Toggle === */}
      <div className="w-full flex justify-end p-6">
        <button
          onClick={() => {
            const newDarkMode = !darkMode;
            setDarkMode(newDarkMode);
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('darkMode', newDarkMode.toString());
            }
            
            // Toggle dark class on document element
            if (newDarkMode) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${baseShadow}`}
        >
          {buttonText}
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className={`px-8 py-3 text-lg font-semibold rounded-2xl transition-all duration-300 ${baseShadow} ${insetShadow} bg-gradient-to-r from-[#FFC107] via-[#FF8A00] to-[#E91E63] text-white`}
            >
              Register Now
            </motion.button>
          </Link>
          <Link href="/login">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className={`px-8 py-3 text-lg font-semibold rounded-2xl transition-all duration-300 ${baseShadow} ${insetShadow}`}
            >
              Login
            </motion.button>
          </Link>
        </div>
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
        
        {/* Social Media Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${baseShadow} ${insetShadow} text-blue-600 hover:text-blue-700`}
            aria-label="Facebook"
            title="Follow us on Facebook"
          >
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${baseShadow} ${insetShadow} text-red-600 hover:text-red-700`}
            aria-label="Pinterest"
            title="Follow us on Pinterest"
          >
            <FontAwesomeIcon icon={faPinterest} size="lg" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${baseShadow} ${insetShadow} text-red-600 hover:text-red-700`}
            aria-label="YouTube"
            title="Subscribe to our YouTube channel"
          >
            <FontAwesomeIcon icon={faYoutube} size="lg" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${baseShadow} ${insetShadow} text-gray-700 hover:text-gray-800`}
            aria-label="GitHub"
            title="Check out our GitHub"
          >
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </motion.button>
        </div>
        
        <p className="mt-6 opacity-70 text-sm">
          © {new Date().getFullYear()} GymSetu. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
