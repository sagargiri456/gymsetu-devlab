"use client";
import { Member } from "./page";
import { MdPerson, MdEdit } from "react-icons/md";

interface MemberCardProps {
  member: Member;
  onClick: () => void;
  onEditDp?: (member: Member) => void;
}

export default function MemberCard({ member, onClick, onEditDp }: MemberCardProps) {
  const getStatus = (): "Active" | "Expired" => {
    // Use expiration_date if available, otherwise fallback to created_at + 30 days
    if (member.expiration_date) {
      const expiration = new Date(member.expiration_date);
      const now = new Date();
      return now <= expiration ? "Active" : "Expired";
    }
    // Fallback: calculate from created_at + 30 days
    const created = new Date(member.created_at);
    const now = new Date();
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30 ? "Active" : "Expired";
  };

  const getDaysLeft = (): number | null => {
    if (member.expiration_date) {
      const expiration = new Date(member.expiration_date);
      const now = new Date();
      const diffTime = expiration.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    // Fallback: calculate from created_at + 30 days
    const created = new Date(member.created_at);
    const now = new Date();
    const expiration = new Date(created);
    expiration.setDate(expiration.getDate() + 30);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatExpirationDate = (): string => {
    if (member.expiration_date) {
      const date = new Date(member.expiration_date);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    // Fallback: calculate from created_at + 30 days
    const created = new Date(member.created_at);
    const expiration = new Date(created);
    expiration.setDate(expiration.getDate() + 30);
    return expiration.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const status = getStatus();
  const isActive = status === "Active";
  const daysLeft = getDaysLeft();
  const expirationDate = formatExpirationDate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card onClick
    if (onEditDp) {
      onEditDp(member);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-[#ecf0f3] rounded-3xl p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] hover:shadow-[inset_8px_8px_16px_#cbced1,inset_-8px_-8px_16px_#ffffff] transition-all cursor-pointer"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative group w-24 h-24">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#ecf0f3] flex items-center justify-center shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
            {member.dp_link ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.dp_link}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <MdPerson size={42} className="text-gray-600" />
            )}
          </div>
          {/* Edit button overlay */}
          {onEditDp && (
            <button
              onClick={handleEditClick}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-200"
              title="Edit profile picture"
            >
              <MdEdit size={20} className="text-white" />
            </button>
          )}
        </div>

        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
          <p className="text-sm text-gray-600">{member.phone}</p>
          
          {/* Expiration Date and Days Left */}
          <div className="mt-3 space-y-1">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Expires:</span> {expirationDate}
            </p>
            {daysLeft !== null && (
              <p className={`text-xs font-medium ${
                daysLeft <= 0
                  ? "text-red-600"
                  : daysLeft <= 7
                  ? "text-orange-600"
                  : "text-green-600"
              }`}>
                {daysLeft < 0 
                  ? `${Math.abs(daysLeft)} days overdue` 
                  : daysLeft === 0 
                  ? "Expires today" 
                  : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
              </p>
            )}
          </div>
        </div>

        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            isActive
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
