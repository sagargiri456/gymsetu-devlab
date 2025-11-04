"use client";
import React, { useState } from "react";
import { getApiUrl } from "@/lib/api";

interface TrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrainerAdded: () => void;
}

const TrainerModal: React.FC<TrainerModalProps> = ({
  isOpen,
  onClose,
  onTrainerAdded,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    dp_link: "",
    state: "",
    zip: "",
    gym_id: 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "gym_id" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(getApiUrl("api/trainers/add_trainer"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onTrainerAdded();
        onClose();
        alert("Trainer added successfully!");
      } else {
        const err = await response.json();
        alert(err.message || "Failed to add trainer");
      }
    } catch (error) {
      console.error(error);
      alert("Network error — please try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4">Add New Trainer</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            "name",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "zip",
            "dp_link",
          ].map((key) => {
            const fieldKey = key as keyof typeof formData;
            return (
              <input
                key={key}
                type={key === "email" ? "email" : "text"}
                name={key}
                value={formData[fieldKey]}
                onChange={handleInputChange}
                placeholder={key.replace("_", " ").toUpperCase()}
                required={key !== "dp_link"}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            );
          })}

          <input
            type="number"
            name="gym_id"
            value={formData.gym_id}
            onChange={handleInputChange}
            min={1}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Trainer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerModal;
