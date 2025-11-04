'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from "@/lib/api";

export default function RegisterGym() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error message when user starts typing
    if (messageType === 'error') {
      setMessage('');
      setMessageType('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const res = await fetch(getApiUrl('api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('✅ Gym registered successfully! Redirecting to login...');
        setMessageType('success');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Display the error message from backend
        const errorMessage = data.message || data.error || 'Registration failed';
        setMessage(`❌ ${errorMessage}`);
        setMessageType('error');
      }
    } catch {
      setMessage('❌ Network error. Please check your connection and try again.');
      setMessageType('error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ecf0f3]">
      <div className="w-full max-w-md p-10 rounded-[35px] bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Register Gym</h2>
          <p className="text-sm text-gray-500 mt-1 tracking-widest">Join GymSetu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {['name', 'address', 'city', 'state', 'zip', 'phone', 'email'].map((field) => (
            <div
              key={field}
              className="rounded-2xl shadow-[inset_6px_6px_10px_#cbced1,inset_-6px_-6px_10px_#ffffff] flex items-center"
            >
              <input
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-[16px] px-4 py-3 rounded-2xl"
              />
            </div>
          ))}
          
          {/* Password field with requirements */}
          <div>
            <div className="rounded-2xl shadow-[inset_6px_6px_10px_#cbced1,inset_-6px_-6px_10px_#ffffff] flex items-center">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setShowPasswordRequirements(true)}
                required
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-[16px] px-4 py-3 rounded-2xl"
              />
            </div>
            
            {/* Password requirements */}
            {showPasswordRequirements && (
              <div className="mt-2 p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                <p className="text-xs font-semibold text-gray-700 mb-2">Password requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                    {formData.password.length >= 8 ? '✓' : '•'} At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                    {/[A-Z]/.test(formData.password) ? '✓' : '•'} One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                    {/[a-z]/.test(formData.password) ? '✓' : '•'} One lowercase letter
                  </li>
                  <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                    {/\d/.test(formData.password) ? '✓' : '•'} One number
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Button with same neomorphic green style as login */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 rounded-2xl text-white font-semibold text-lg transition-all duration-300 bg-[#67d18a] shadow-[7px_7px_8px_#cbced1,-7px_-7px_8px_#ffffff] hover:bg-[#5fb87d] active:bg-[#4a9764] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register Gym'}
          </button>
        </form>

        {/* Error/Success Message */}
        {message && (
          <div className={`mt-6 p-4 rounded-2xl text-center font-medium ${
            messageType === 'error' 
              ? 'bg-red-50 text-red-700 shadow-[inset_4px_4px_8px_#fca5a5,inset_-4px_-4px_8px_#fee2e2]' 
              : messageType === 'success'
              ? 'bg-green-50 text-green-700 shadow-[inset_4px_4px_8px_#86efac,inset_-4px_-4px_8px_#dcfce7]'
              : 'text-gray-700'
          }`}>
            {message}
          </div>
        )}
        
        {/* Login link */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-[#67d18a] hover:text-[#5fb87d] font-semibold transition-colors">
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}
