import React from 'react';
import { useEduMate } from '../context/EduMateContext';
import { Pill, CalendarHeart, Sun, Award, RotateCcw } from 'lucide-react';

export default function SeniorSummary() {
    const { userName, medications, appointments, userStats, resetUserStats } = useEduMate();

    const todayString = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const medsToday = medications.length;

    // Nearest appointment
    const futureAppts = [...appointments]
        .filter(app => new Date(app.datetime).getTime() > Date.now())
        .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    const nextAppt = futureAppts.length > 0 ? futureAppts[0] : null;
    let nextApptStr = 'Ninguna a la vista';
    if (nextAppt) {
        const dateStr = new Date(nextAppt.datetime).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
        nextApptStr = `${dateStr} con ${nextAppt.doctor}`;
    }

    return (
        <div className="flex flex-col h-full w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-12 overflow-y-auto">
            <div className="flex items-center gap-6 pb-8 border-b border-slate-100 shrink-0">
                <div className="bg-amber-100 p-5 rounded-2xl text-amber-500">
                    <Sun className="w-16 h-16" />
                </div>
                <div>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight">¡Buenos días, {userName || 'Amigo'}!</h2>
                    <p className="text-2xl sm:text-3xl text-slate-500 font-medium mt-3 capitalize">Hoy es {todayString}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-6 shadow-sm">
                    <div className="bg-white p-5 rounded-full text-rose-500 shadow-sm">
                        <Pill className="w-16 h-16" />
                    </div>
                    <h3 className="text-4xl font-bold text-slate-800">
                        <span className="text-rose-600 font-black text-5xl mx-2">{medsToday}</span> medicinas
                    </h3>
                    <p className="text-2xl text-slate-600 font-medium">para hoy</p>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-6 shadow-sm">
                    <div className="bg-white p-5 rounded-full text-indigo-500 shadow-sm">
                        <CalendarHeart className="w-16 h-16" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">Próxima cita:</h3>
                    <p className="text-xl text-indigo-800 font-bold bg-white px-4 py-3 rounded-2xl shadow-sm border border-indigo-100 w-full h-full flex items-center justify-center text-center">
                        {nextApptStr}
                    </p>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 shadow-sm relative">
                    <button
                        onClick={resetUserStats}
                        className="absolute top-4 right-4 p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
                        aria-label="Reiniciar estadísticas"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <div className="bg-white p-5 rounded-full text-amber-500 shadow-sm">
                        <Award className="w-16 h-16" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">Gimnasio Mental</h3>
                    <div className="flex gap-4 w-full justify-center">
                        <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-amber-100 text-center flex-1">
                            <p className="text-3xl font-black text-amber-600">{userStats?.gamesPlayed || 0}</p>
                            <p className="text-sm font-bold text-slate-500 uppercase mt-1">Jugadas</p>
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-amber-100 text-center flex-1">
                            <p className="text-3xl font-black text-emerald-600">{userStats?.gamesWon || 0}</p>
                            <p className="text-sm font-bold text-slate-500 uppercase mt-1">Victorias</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
