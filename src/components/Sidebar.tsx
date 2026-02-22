"use client";

import React from 'react';
import { useEduMate } from '../context/EduMateContext';
import { Bot, CheckSquare, TrendingUp, Stethoscope, UserCircle, HeartPulse, Pill } from 'lucide-react';

export default function Sidebar() {
    const { activeTab, setActiveTab, aiName, startMedicationConsult } = useEduMate();

    return (
        <aside className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shadow-sm flex-shrink-0">
            <div className="flex flex-col gap-6">
                {/* Logo / Header */}
                <div className="flex items-center gap-2 px-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">E</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">Edumate Senior</h1>
                </div>

                {/* Profile Selector (Now singular Companion) */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider px-1">Tu Acompañante</p>
                    <div className="flex items-center gap-3 w-full p-2 rounded-xl bg-emerald-100 ring-1 ring-black/5 shadow-sm transform scale-[1.02]">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm text-emerald-600">
                            <UserCircle className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-slate-800">
                            {aiName}
                        </span>
                    </div>
                </div>

                {/* Navigation Tools */}
                <nav className="flex flex-col gap-2 mt-2">
                    <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider px-3">Secciones</p>

                    <button
                        onClick={() => setActiveTab('tutor')}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-colors ${activeTab === 'tutor' ? 'bg-emerald-100/50 text-slate-800 shadow-sm' : 'hover:bg-slate-100 text-slate-600'}`}>
                        <Bot className={`w-5 h-5 ${activeTab === 'tutor' ? 'text-emerald-600' : ''}`} />
                        <span className="flex-1 text-left">Conversar</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('tareas')}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-colors ${activeTab === 'tareas' ? 'bg-emerald-100/50 text-slate-800 shadow-sm' : 'hover:bg-slate-100 text-slate-600'}`}>
                        <CheckSquare className={`w-5 h-5 ${activeTab === 'tareas' ? 'text-emerald-600' : ''}`} />
                        <span className="flex-1 text-left">Actividades</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('progreso')}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-colors ${activeTab === 'progreso' ? 'bg-emerald-100/50 text-slate-800 shadow-sm' : 'hover:bg-slate-100 text-slate-600'}`}>
                        <TrendingUp className={`w-5 h-5 ${activeTab === 'progreso' ? 'text-emerald-600' : ''}`} />
                        <span className="flex-1 text-left">Mi Resumen</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('familia')}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-colors ${activeTab === 'familia' ? 'bg-emerald-100/50 text-slate-800 shadow-sm' : 'hover:bg-slate-100 text-slate-600'}`}>
                        <Stethoscope className={`w-5 h-5 ${activeTab === 'familia' ? 'text-emerald-600' : ''}`} />
                        <span className="flex-1 text-left uppercase text-sm font-bold tracking-wider">Agenda Médica</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('hoja_farmacia')}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-colors ${activeTab === 'hoja_farmacia' ? 'bg-rose-100/50 text-slate-800 shadow-sm' : 'hover:bg-slate-100 text-slate-600'}`}>
                        <Pill className={`w-5 h-5 ${activeTab === 'hoja_farmacia' ? 'text-rose-600' : ''}`} />
                        <span className="flex-1 text-left uppercase text-sm font-bold tracking-wider">Hoja de Farmacia</span>
                    </button>

                    {/* New Medication Consultation Button */}
                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <button
                            onClick={startMedicationConsult}
                            className="flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-emerald-500/50 active:scale-95 group"
                        >
                            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <span className="flex-1 text-left text-sm font-bold leading-tight">Consultar a la IA sobre mi medicación</span>
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
}
