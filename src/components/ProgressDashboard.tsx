import React from 'react';
import { useEduMate } from '../context/EduMateContext';
import { Trophy, Flame, CheckCircle, BookOpen } from 'lucide-react';

export default function ProgressDashboard() {
    const subjects = [
        { name: 'Lectura', progress: 75, color: 'bg-emerald-500' },
        { name: 'Memoria', progress: 60, color: 'bg-indigo-500' },
        { name: 'Actualidad', progress: 85, color: 'bg-teal-500' },
        { name: 'Juegos', progress: 40, color: 'bg-amber-500' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Mi Resumen</h2>
                    <p className="text-slate-500">Sigue así, estás manteniendo una mente activa y saludable.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Hito Actual</p>
                        <p className="text-xl font-bold text-slate-800">Mente Activa</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                        <Flame className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Racha</p>
                        <p className="text-2xl font-bold text-slate-800">5 Días</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="bg-teal-100 p-3 rounded-xl text-teal-600">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Actividades</p>
                        <p className="text-2xl font-bold text-slate-800">12</p>
                    </div>
                </div>
            </div>

            <div className="bg-white flex-1 p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Actividad por Categorías</h3>
                </div>

                <div className="space-y-6">
                    {subjects.map((subject) => (
                        <div key={subject.name} className="space-y-2">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-slate-700">{subject.name}</span>
                                <span className="text-slate-500">{subject.progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${subject.color} transition-all duration-1000 ease-out`}
                                    style={{ width: `${subject.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
