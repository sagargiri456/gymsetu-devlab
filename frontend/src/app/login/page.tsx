"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    // TODO: connect with Flask API here
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ecf0f3] text-gray-700 font-[Lato]">
      <div className="w-[430px] h-[500px] p-8 rounded-[35px] shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.8)] bg-[#ecf0f3]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-[100px] h-[100px] rounded-full bg-[#ecf0f3] shadow-[0px_0px_2px_#5f5f5f,0px_0px_0px_5px_#ecf0f3,8px_8px_15px_#a7aaaf,-8px_-8px_15px_#ffffff] overflow-hidden">
            <Image
              src="/gymsetu-logo.png"
              alt="GymSetu Logo"
              width={100}
              height={100}
              className="object-cover rounded-full"
            />
          </div>
        </div>

        {/* Titles */}
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-[#FFC107] via-[#FF8A00] to-[#E91E63] bg-clip-text text-transparent">
          GymSetu
        </h1>
        <p className="text-center text-sm tracking-[3px] text-[#E91E63] mt-2">
          Member Login
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div className="flex items-center rounded-[20px] px-4 py-3 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
            <svg
              fill="#999"
              viewBox="0 0 1024 1024"
              className="h-5 w-5 mr-3"
            >
              <path d="M896 307.2h-819.2c-42.347 0-76.8 34.453-76.8 76.8v460.8c0
              42.349 34.453 76.8 76.8 76.8h819.2c42.349 0 76.8-34.451
              76.8-76.8v-460.8c0-42.347-34.451-76.8-76.8-76.8zM896
              358.4c1.514 0 2.99 0.158 4.434 0.411l-385.632 257.090c-14.862
              9.907-41.938 9.907-56.802 0l-385.634-257.090c1.443-0.253
              2.92-0.411 4.434-0.411h819.2z" />
            </svg>
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-transparent outline-none text-[18px] placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center rounded-[20px] px-4 py-3 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
            <svg
              fill="#999"
              viewBox="0 0 1024 1024"
              className="h-5 w-5 mr-3"
            >
              <path d="M742.4 409.6h-25.6v-76.8c0-127.043-103.
              357-230.4-230.4-230.4s-230.4 103.357-230.4
              230.4v76.8h-25.6c-42.347 0-76.8 34.453-76.8
              76.8v409.6c0 42.347 34.453 76.8 76.8 76.8h512c42.347
              0 76.8-34.453 76.8-76.8v-409.6c0-42.347-34.453-76.
              8-76.8-76.8zM307.2 332.8c0-98.811 80.389-179.2
              179.2-179.2s179.2 80.389 179.2 179.2v76.8h-358.4v-76.8z" />
            </svg>
            <input
              type="password"
              placeholder="Password"
              className="flex-1 bg-transparent outline-none text-[18px] placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full h-[60px] rounded-[25px] font-bold text-white text-lg shadow-[7px_7px_8px_#cbced1,-7px_-7px_8px_#ffffff] bg-gradient-to-r from-[#FFC107] via-[#FF8A00] to-[#E91E63] hover:opacity-90 transition-all"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-5 text-gray-400 text-sm">
          <a href="#" className="hover:text-[#FF8A00] transition">
            Forgot password?
          </a>{" "}
          or{" "}
          <a href="#" className="hover:text-[#FF8A00] transition">
            Signup
          </a>
        </div>
      </div>
    </main>
  );
}
