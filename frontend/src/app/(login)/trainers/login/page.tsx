"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import { verifyToken } from "@/lib/auth";

interface Gym {
  id: number;
  name: string;
}

export default function TrainerLoginPage() {
  const [step, setStep] = useState<1 | 2>(1); // 1: Gym + Email, 2: Password
  const [gymId, setGymId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch gyms list on component mount
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await fetch(getApiUrl("api/gyms/get_gyms"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.gyms) {
            setGyms(data.gyms);
            console.log(data.gyms);
          } else if (Array.isArray(data)) {
            setGyms(data);
          }
        } else {
          console.error("Failed to fetch gyms:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch gyms:", error);
        // CORS or network error - gyms will be empty, user can still try to proceed
      }
    };

    fetchGyms();
  }, []);

  // Check if trainer is already logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      // Check for trainer token
      const trainerToken = localStorage.getItem("trainer_access_token");
      if (trainerToken) {
        // Also set as access_token for compatibility
        localStorage.setItem("access_token", trainerToken);
        // Verify token is still valid
        const isValid = await verifyToken();
        if (isValid) {
          // Redirect to trainer dashboard if already logged in
          router.push("/trainer");
        }
      }
    };
    checkAuth();
  }, [router]);

  // Step 1: Continue with gym and email
  const handleContinue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check if trainer exists and has password
      const response = await fetch(getApiUrl("api/auth/trainer/check"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gym_id: parseInt(gymId), email }),
      });

      if (response.ok) {
        const data = await response.json();
        // If password exists, needsPasswordSetup = false, otherwise true
        setNeedsPasswordSetup(!data.has_password);
        setStep(2);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Trainer not found" }));
        setError(errorData.error || errorData.message || "Trainer not found. Please check your email and gym selection.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Cannot connect to server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Login or Setup Password
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (needsPasswordSetup) {
        // Step 2a: Setup password first
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        // Setup password endpoint
        const setupResponse = await fetch(getApiUrl("api/auth/trainer/setup-password"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gym_id: parseInt(gymId),
            email,
            password,
          }),
        });

        if (!setupResponse.ok) {
          const errorData = await setupResponse.json().catch(() => ({ error: "Failed to setup password" }));
          setError(errorData.error || errorData.message || "Failed to setup password. Please try again.");
          setLoading(false);
          return;
        }

        // Password setup successful, get token and login
        const setupData = await setupResponse.json();
        if (setupData.success && setupData.access_token) {
          localStorage.setItem("trainer_access_token", setupData.access_token);
          // Also store as access_token for compatibility with auth functions
          localStorage.setItem("access_token", setupData.access_token);
          router.push("/trainer");
        } else {
          setError("Failed to setup password. Please try again.");
          setLoading(false);
        }
      } else {
        // Step 2b: Login with password
        const loginResponse = await fetch(getApiUrl("api/auth/trainer/login"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gym_id: parseInt(gymId),
            email,
            password,
          }),
        });

        if (!loginResponse.ok) {
          const errorData = await loginResponse.json().catch(() => ({ error: "Login failed" }));
          setError(errorData.error || errorData.message || "Login failed. Please check your password and try again.");
          setLoading(false);
          return;
        }

        // Login successful
        const loginData = await loginResponse.json();
        if (loginData.access_token) {
          localStorage.setItem("trainer_access_token", loginData.access_token);
          // Also store as access_token for compatibility with auth functions
          localStorage.setItem("access_token", loginData.access_token);
          router.push("/trainer");
        } else {
          setError("Login failed. Please try again.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Cannot connect to server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setPassword("");
    setConfirmPassword("");
    setError("");
    setNeedsPasswordSetup(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ecf0f3] text-gray-700 font-[Lato]">
      <div className="w-[430px] h-[550px] p-8 rounded-[35px] shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.8)] bg-[#ecf0f3]">
        {/* Logo with Trainer Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-[100px] h-[100px] rounded-full bg-[#ecf0f3] shadow-[0px_0px_2px_#5f5f5f,0px_0px_0px_5px_#ecf0f3,8px_8px_15px_#a7aaaf,-8px_-8px_15px_#ffffff] flex items-center justify-center">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#E91E63]"
            >
              {/* Dumbbell icon for trainers */}
              <path
                d="M6 5L18 5C18.5523 5 19 5.44772 19 6L19 18C19 18.5523 18.5523 19 18 19L6 19C5.44772 19 5 18.5523 5 18L5 6C5 5.44772 5.44772 5 6 5Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M9 12L15 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 9L5 9L5 15L3 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M19 9L21 9L21 15L19 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Titles */}
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-[#FFC107] via-[#FF8A00] to-[#E91E63] bg-clip-text text-transparent">
          GymSetu
        </h1>
        <p className="text-center text-sm tracking-[3px] text-[#E91E63] mt-2">
          TRAINER LOGIN
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 rounded-[15px] bg-red-100 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Step 1: Gym Selection + Email */}
        {step === 1 && (
          <form onSubmit={handleContinue} className="mt-8 space-y-5">
            {/* Gym Selection */}
            <div className="flex items-center rounded-[20px] px-4 py-3 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
              <svg
                fill="#999"
                viewBox="0 0 24 24"
                className="h-5 w-5 mr-3"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <select
                value={gymId}
                onChange={(e) => setGymId(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[18px] text-gray-700"
                required
              >
                <option value="">Select Gym</option>
                {gyms.map((gym) => (
                  <option key={gym.id} value={gym.id}>
                    {gym.name}
                  </option>
                ))}
              </select>
            </div>

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
                placeholder="Trainer Email"
                className="flex-1 bg-transparent outline-none text-[18px] placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[60px] rounded-[25px] font-bold text-white text-lg shadow-[7px_7px_8px_#cbced1,-7px_-7px_8px_#ffffff] bg-gradient-to-r from-[#FFC107] via-[#FF8A00] to-[#E91E63] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {/* Step 2: Password or Setup Password */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              className="text-sm text-[#FF8A00] hover:underline flex items-center"
            >
              ← Back
            </button>

            {/* Password Field */}
            <div className="flex items-center rounded-[20px] px-4 py-3 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
              <svg
                fill="#999"
                viewBox="0 0 24 24"
                className="h-5 w-5 mr-3"
              >
                <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h4c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
              </svg>
              <input
                type="password"
                placeholder={needsPasswordSetup ? "Set Password" : "Password"}
                className="flex-1 bg-transparent outline-none text-[18px] placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password (only for setup) */}
            {needsPasswordSetup && (
              <div className="flex items-center rounded-[20px] px-4 py-3 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
                <svg
                  fill="#999"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 mr-3"
                >
                  <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h4c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                </svg>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="flex-1 bg-transparent outline-none text-[18px] placeholder-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[60px] rounded-[25px] font-bold text-white text-lg shadow-[7px_7px_8px_#cbced1,-7px_-7px_8px_#ffffff] bg-gradient-to-r from-[#FFC107] via-[#FF8A00] to-[#E91E63] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : needsPasswordSetup
                ? "Setup Password & Login"
                : "Trainer Login"}
            </button>
          </form>
        )}

        {/* Navigation Links */}
        <div className="mt-6 space-y-3">
          {/* Switch to Gym Login */}
          <div className="text-center text-gray-400 text-sm">
            <a href="/login" className="hover:text-[#FF8A00] transition">
              Switch to Gym Login
            </a>
          </div>
          
          {/* Switch to Member Login */}
          <div className="text-center text-gray-400 text-sm">
            <a href="/members/login" className="hover:text-[#FF8A00] transition">
              Switch to Member Login
            </a>
          </div>
        </div>

        {/* Additional Links */}
        <div className="text-center mt-6 text-gray-400 text-sm space-y-2">
          <div>
            <a href="/trainers/forgot-password" className="hover:text-[#FF8A00] transition">
              Forgot password?
            </a>
          </div>
          <div>
            <a href="/trainers/register" className="hover:text-[#FF8A00] transition">
              Register as Trainer
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}