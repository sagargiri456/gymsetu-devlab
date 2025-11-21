"use client";
import { useState } from "react";
import { Member } from "./page";
import { MdClose, MdPerson, MdCalendarToday } from "react-icons/md";
import { getApiUrl } from "@/lib/api";

interface MemberModalProps {
  member: Member;
  onClose: () => void;
  onMemberUpdated?: () => void; // Callback to refresh member list
}

export default function MemberModal({ member, onClose, onMemberUpdated }: MemberModalProps) {
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getStatus = (): "Active" | "Expired" => {
    if (member.expiration_date) {
      const expiration = new Date(member.expiration_date);
      const now = new Date();
      return now <= expiration ? "Active" : "Expired";
    }
    return "Expired";
  };

  const calculateNewExpirationDate = (monthsToAdd: number): string => {
    const today = new Date();
    let baseDate: Date;

    if (member.expiration_date) {
      const expiration = new Date(member.expiration_date);
      baseDate = expiration > today ? expiration : today;
    } else {
      baseDate = today;
    }

    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);
    return newDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleExtendSubscription = async () => {
    if (months <= 0 || !Number.isInteger(months)) {
      setError("Please enter a valid number of months (1 or more)");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const response = await fetch(getApiUrl("/api/members/extend_subscription"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          member_id: member.id,
          months: months,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Subscription extended successfully! New expiration date: ${new Date(data.new_expiration_date).toLocaleDateString()}`);
        setMonths(1);
        // Refresh member list if callback provided
        if (onMemberUpdated) {
          setTimeout(() => {
            onMemberUpdated();
            setShowExtendModal(false);
            setSuccess(null);
          }, 1500);
        } else {
          setTimeout(() => {
            setShowExtendModal(false);
            setSuccess(null);
          }, 2000);
        }
      } else {
        setError(data.error || data.message || "Failed to extend subscription");
      }
    } catch (err) {
      console.error("Error extending subscription:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const status = getStatus();
  const isExpired = status === "Expired";

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <MdClose size={22} />
          </button>

          <div className="flex flex-col items-center text-center space-y-4 mt-3">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-md">
              {member.dp_link ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.dp_link}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#ecf0f3] flex items-center justify-center">
                  <MdPerson size={42} className="text-gray-600" />
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-800">{member.name}</h2>
            <p className="text-sm text-gray-600">{member.email}</p>
            <p className="text-sm text-gray-600">{member.phone}</p>

            <div className="w-full mt-4 border-t pt-3 text-left text-sm text-gray-700 space-y-1">
              <p>
                <strong>Address:</strong> {member.address}
              </p>
              <p>
                <strong>City:</strong> {member.city}
              </p>
              <p>
                <strong>State:</strong> {member.state}
              </p>
              <p>
                <strong>ZIP:</strong> {member.zip}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(member.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  {member.expiration_date ? (
                    <p>
                      <strong>Expiration Date:</strong>{" "}
                      {new Date(member.expiration_date).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-gray-500">No expiration date set</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isExpired
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>

            {/* Extend Subscription Button */}
            <button
              onClick={() => setShowExtendModal(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MdCalendarToday size={18} />
              Extend Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Extend Subscription Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
            <button
              onClick={() => {
                setShowExtendModal(false);
                setError(null);
                setSuccess(null);
                setMonths(1);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <MdClose size={22} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Extend Subscription</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Months
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={months}
                  onChange={(e) => setMonths(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter months"
                />
              </div>

              {months > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Current expiration:</strong>{" "}
                    {member.expiration_date
                      ? new Date(member.expiration_date).toLocaleDateString()
                      : "Not set"}
                  </p>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    <strong>New expiration:</strong> {calculateNewExpirationDate(months)}
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowExtendModal(false);
                    setError(null);
                    setSuccess(null);
                    setMonths(1);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtendSubscription}
                  disabled={loading || months <= 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Extending..." : "Extend Subscription"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
