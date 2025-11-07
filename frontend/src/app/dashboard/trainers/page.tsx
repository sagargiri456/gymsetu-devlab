"use client";
import React, { useEffect, useState } from "react";
import TrainerCard from "./TrainerCard";
import TrainerModal from "./TrainerModal";
import TrainerDetailsModal from "./TrainerDetailsModal";
import Modal from "../../components/Modal";
import { Trainer } from "./TrainerTypes";
import { MdAdd } from "react-icons/md";
import { getApiUrl } from "@/lib/api";
import { useRouter } from "next/navigation";

const TrainersPage: React.FC = () => {
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [dpLink, setDpLink] = useState("");

  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(getApiUrl("api/trainers/get_all_trainers"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTrainers(data.trainers || []);
      } else if (res.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditDp = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setDpLink(trainer.dp_link || "");
  };

  const handleUpdateDpLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainer) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(getApiUrl(`api/trainers/update_trainer`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          trainer_id: editingTrainer.id,
          dp_link: dpLink,
        }),
      });

      if (response.ok) {
        // Update the trainer in the trainers array
        setTrainers((prev) =>
          prev.map((t) => (t.id === editingTrainer.id ? { ...t, dp_link: dpLink } : t))
        );
        setEditingTrainer(null);
        setDpLink("");
        alert("Profile picture updated successfully!");
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/login");
      } else {
        const errorData = await response.json();
        console.error("Failed to update profile picture:", response.status, response.statusText);
        console.error("Error response:", errorData);
        alert(`Failed to update profile picture: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to server. Please check your connection and try again.");
    }
  };

  if (loading) {
    return (
      <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 flex items-center justify-center min-h-screen bg-[#ecf0f3] text-gray-500">
        Loading trainers...
      </div>
    );
  }

  return (
    <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-6 sm:p-8 lg:p-12 min-h-screen bg-[#ecf0f3]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 mt-4 lg:mt-6 gap-6 px-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Trainers
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-sm rounded-full text-white bg-green-600 hover:bg-green-700 transition-all duration-200 min-w-[160px] shadow-lg hover:shadow-xl"
        >
          <MdAdd size={20} className="mr-2" />
          Add Trainer
        </button>
      </div>

      {!Array.isArray(trainers) || trainers.length === 0 ? (
        <p className="text-gray-500">No trainers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onClick={() => setSelectedTrainer(trainer)}
              onEditDp={handleEditDp}
            />
          ))}
        </div>
      )}

      {/* Edit DP Link Modal */}
      <Modal
        isOpen={editingTrainer !== null}
        onClose={() => {
          setEditingTrainer(null);
          setDpLink("");
        }}
        title="Edit Profile Picture"
      >
        <form onSubmit={handleUpdateDpLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={dpLink}
              onChange={(e) => setDpLink(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="mt-2 text-xs text-gray-500">
              Enter the URL of the profile picture
            </p>
          </div>

          {dpLink && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dpLink}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setEditingTrainer(null);
                setDpLink("");
              }}
              className="px-6 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>

      <TrainerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTrainerAdded={fetchTrainers}
      />

      <TrainerDetailsModal
        trainer={selectedTrainer}
        onClose={() => setSelectedTrainer(null)}
      />
    </div>
  );
};

export default TrainersPage;
