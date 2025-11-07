"use client";
import React from "react";
import { Trainer } from "./TrainerTypes";
import { MdOutlineSportsGymnastics, MdEdit } from "react-icons/md";

interface TrainerCardProps {
  trainer: Trainer;
  onClick?: () => void;
  onEditDp?: (trainer: Trainer) => void;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ trainer, onClick, onEditDp }) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card onClick
    if (onEditDp) {
      onEditDp(trainer);
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
            {trainer.dp_link ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={trainer.dp_link}
                alt={trainer.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />
            ) : (
              <MdOutlineSportsGymnastics size={42} className="text-gray-600" />
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
          <h3 className="text-lg font-semibold text-gray-800">{trainer.name}</h3>
          <p className="text-sm text-gray-600">{trainer.email}</p>
          <p className="text-sm text-gray-600">{trainer.phone}</p>
        </div>

        <div className="text-xs text-gray-500">
          {trainer.city}, {trainer.state} ({trainer.zip})
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;
