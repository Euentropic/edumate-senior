import React from 'react';
import { useEduMate } from '../context/EduMateContext';
import { Pill, CalendarHeart, Sun } from 'lucide-react';

export default function SeniorSummary() {
    const { userName, medications, appointments } = useEduMate();

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-6 shadow-sm">
                    <div className="bg-white p-5 rounded-full text-rose-500 shadow-sm">
                        <Pill className="w-16 h-16" />
                    </div>
                    <h3 className="text-4xl font-bold text-slate-800">
                        Tienes <span className="text-rose-600 font-black text-5xl mx-2">{medsToday}</span> medicinas
                    </h3>
                    <p className="text-3xl text-slate-600 font-medium">programadas para hoy</p>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-6 shadow-sm">
                    <div className="bg-white p-5 rounded-full text-indigo-500 shadow-sm">
                        <CalendarHeart className="w-16 h-16" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">Próxima cita médica:</h3>
                    <p className="text-2xl text-indigo-800 font-bold bg-white px-6 py-4 rounded-2xl shadow-sm border border-indigo-100 w-full h-full flex items-center justify-center">
                        {nextApptStr}
                    </p>
                </div>
            </div>
        </div>
    );
}
