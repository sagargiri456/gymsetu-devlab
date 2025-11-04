"use client";
import React, { useEffect, useState } from "react";
import TrainerCard from "./TrainerCard";
import TrainerModal from "./TrainerModal";
import TrainerDetailsModal from "./TrainerDetailsModal";
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

  return (
    <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-6 min-h-screen bg-[#ecf0f3]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 px-2">
        <h4 className="text-2xl lg:text-3xl font-bold text-gray-800">
          Trainers
        </h4>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-sm rounded-full text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <MdAdd size={20} className="mr-2" />
          New Trainer
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12 text-gray-500">
          Loading trainers...
        </div>
      ) : trainers.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No trainers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onClick={() => setSelectedTrainer(trainer)}
            />
          ))}
        </div>
      )}

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
