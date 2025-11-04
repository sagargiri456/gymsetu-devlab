"use client";
import { Member } from "./page";
import { MdClose } from "react-icons/md";
import { MdPerson } from "react-icons/md";

interface MemberModalProps {
  member: Member;
  onClose: () => void;
}

export default function MemberModal({ member, onClose }: MemberModalProps) {
  return (
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
            {member.expiration_date && (
              <p>
                <strong>Expiration Date:</strong>{" "}
                {new Date(member.expiration_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
