'use client';

import { useState, useEffect } from 'react';
import ChatInterface from "@/components/ChatInterface";
import Sidebar from "@/components/Sidebar";
import SeniorSummary from "@/components/SeniorSummary";
import MedicalAgenda from "@/components/MedicalAgenda";
import PharmacySheet from "@/components/PharmacySheet";
import TasksDashboard from "@/components/TasksDashboard";
import SeniorProfileModal from "@/components/SeniorProfileModal";
import GamesModule from "@/components/GamesModule";
import { useEduMate } from "@/context/EduMateContext";

export default function Home() {
  const { activeTab, userName } = useEduMate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (!userName) {
      setIsProfileModalOpen(true);
    }
  }, [userName]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="w-full max-w-full px-4 lg:px-8 py-6 flex-1 overflow-y-auto">
          {activeTab === 'tutor' ? <ChatInterface /> : null}
          {activeTab === 'tareas' ? <TasksDashboard /> : null}
          {activeTab === 'progreso' ? <SeniorSummary /> : null}
          {activeTab === 'juegos' ? <GamesModule /> : null}
          {activeTab === 'familia' ? <MedicalAgenda /> : null}
          {activeTab === 'hoja_farmacia' ? <PharmacySheet /> : null}
        </div>
      </div>

      <SeniorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </main>
  );
}