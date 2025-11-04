"use client";
import React from "react";
import { Trainer } from "./TrainerTypes";
import { MdClose } from "react-icons/md";

interface TrainerDetailsModalProps {
  trainer: Trainer | null;
  onClose: () => void;
}

const TrainerDetailsModal: React.FC<TrainerDetailsModalProps> = ({
  trainer,
  onClose,
}) => {
  if (!trainer) return null;

  const fallback = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={trainer.dp_link || fallback}
              alt={trainer.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800">{trainer.name}</h2>
          <p className="text-sm text-gray-600">{trainer.email}</p>
          <p className="text-sm text-gray-600">{trainer.phone}</p>

          <div className="w-full mt-4 border-t pt-3 text-left text-sm text-gray-700 space-y-1">
            <p>
              <strong>Address:</strong> {trainer.address}
            </p>
            <p>
              <strong>City:</strong> {trainer.city}
            </p>
            <p>
              <strong>State:</strong> {trainer.state}
            </p>
            <p>
              <strong>ZIP:</strong> {trainer.zip}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(trainer.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>Gym ID:</strong> {trainer.gym_id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetailsModal;
