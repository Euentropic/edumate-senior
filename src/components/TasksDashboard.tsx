import React, { useState, useEffect } from 'react';
import { useEduMate } from '../context/EduMateContext';
import { CheckCircle2, Circle, Clock, BookOpen, Target, Brain, Calculator, Puzzle, Eye, Sparkles } from 'lucide-react';
import { getRandomActivity, CognitiveActivity } from '../services/activityService';

export default function TasksDashboard() {
    const { setActiveTab, startCognitiveActivity } = useEduMate();
    const [dailyActivity, setDailyActivity] = useState<CognitiveActivity | null>(null);

    useEffect(() => {
        setDailyActivity(getRandomActivity());
    }, []);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Brain': return <Brain className="w-6 h-6 text-emerald-600" />;
            case 'Calculator': return <Calculator className="w-6 h-6 text-emerald-600" />;
            case 'BookOpen': return <BookOpen className="w-6 h-6 text-emerald-600" />;
            case 'Puzzle': return <Puzzle className="w-6 h-6 text-emerald-600" />;
            case 'Eye': return <Eye className="w-6 h-6 text-emerald-600" />;
            default: return <Sparkles className="w-6 h-6 text-emerald-600" />;
        }
    };
    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between pb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Actividades Diarias</h2>
                    <p className="text-slate-500 font-medium mt-1">Sugerencias para mantener la mente activa.</p>
                </div>
            </div>

            {/* AI Suggestion */}
            <div className="rounded-2xl border p-5 flex gap-4 items-start shadow-sm transition-colors bg-emerald-50 text-emerald-700 border-emerald-200">
                <div className="bg-white p-2.5 rounded-full shadow-sm flex-shrink-0 mt-1">
                    {dailyActivity ? getIcon(dailyActivity.iconName) : <Sparkles className="w-6 h-6 text-emerald-600" />}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                        Sugerencia del Día: {dailyActivity?.title}
                        <span className="bg-white text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider shadow-sm text-emerald-600">
                            Recomendado
                        </span>
                    </h3>
                    <p className="text-slate-700 font-medium leading-relaxed">
                        {dailyActivity?.description || 'Cargando sugerencia...'}
                    </p>
                    <button
                        onClick={() => dailyActivity && startCognitiveActivity(dailyActivity.title)}
                        className="mt-3 px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-bold text-slate-800 hover:shadow-md transition-all active:scale-95"
                    >
                        Empezar actividad
                    </button>
                </div>
            </div>

            {/* Tasks Two-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

                {/* Pending Tasks */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
                        <div className="bg-slate-100 p-2 rounded-lg">
                            <Clock className="w-5 h-5 text-slate-600" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Sugerencias</h3>
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md ml-auto">
                            3 Retos
                        </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                        {/* Task 1 */}
                        <div
                            onClick={() => startCognitiveActivity('La Palabra Oculta')}
                            className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer shadow-sm hover:shadow"
                        >
                            <button className="mt-1 flex-shrink-0 text-slate-300 group-hover:text-emerald-500 transition-colors">
                                <Circle className="w-6 h-6" />
                            </button>
                            <div className="flex-1">
                                <p className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">La Palabra Oculta</p>
                                <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-500">
                                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Vocabulario</span>
                                </div>
                            </div>
                        </div>

                        {/* Task 2 */}
                        <div
                            onClick={() => startCognitiveActivity('Anagramas')}
                            className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50 transition-all cursor-pointer shadow-sm hover:shadow"
                        >
                            <button className="mt-1 flex-shrink-0 text-slate-300 group-hover:text-amber-500 transition-colors">
                                <Target className="w-6 h-6" />
                            </button>
                            <div className="flex-1">
                                <p className="font-bold text-slate-800 group-hover:text-amber-700 transition-colors">Anagramas</p>
                                <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-500">
                                    <span className="flex items-center gap-1"><Puzzle className="w-3.5 h-3.5" /> Visión Espacial</span>
                                </div>
                            </div>
                        </div>

                        {/* Task 3 */}
                        <div
                            onClick={() => startCognitiveActivity('Cálculo Encadenado')}
                            className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm hover:shadow"
                        >
                            <button className="mt-1 flex-shrink-0 text-slate-300 group-hover:text-indigo-500 transition-colors">
                                <Calculator className="w-6 h-6" />
                            </button>
                            <div className="flex-1">
                                <p className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">Cálculo Encadenado</p>
                                <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-500">
                                    <span className="flex items-center gap-1"><Calculator className="w-3.5 h-3.5" /> Matemáticas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Completed Tasks */}
                <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 flex flex-col">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Completadas hoy</h3>
                    </div>

                    <div className="space-y-3 flex-1">
                        {/* Task 3 */}
                        <div className="flex items-start gap-3 p-3 rounded-xl border border-green-100 bg-white/60 opacity-70">
                            <div className="mt-1 flex-shrink-0 text-emerald-500">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-500 line-through decoration-slate-300">Paseo de 30 minutos</p>
                                <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-400">
                                    <span>Completado a las 10:30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
