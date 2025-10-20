'use client';
import { useState } from 'react';

export default function RegisterGym() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) setMessage('✅ Gym registered successfully!');
      else setMessage(`❌ ${data.error || 'Registration failed'}`);
    } catch {
      setMessage('❌ Network error');
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
          {['name', 'address', 'city', 'state', 'zip', 'phone', 'email', 'password'].map((field) => (
            <div
              key={field}
              className="rounded-2xl shadow-[inset_6px_6px_10px_#cbced1,inset_-6px_-6px_10px_#ffffff] flex items-center"
            >
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-[16px] px-4 py-3 rounded-2xl"
              />
            </div>
          ))}

          {/* Button with same neomorphic green style as login */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 rounded-2xl text-white font-semibold text-lg transition-all duration-300 bg-[#67d18a] shadow-[7px_7px_8px_#cbced1,-7px_-7px_8px_#ffffff] hover:bg-[#5fb87d] active:bg-[#4a9764]"
          >
            {loading ? 'Registering...' : 'Register Gym'}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-gray-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
