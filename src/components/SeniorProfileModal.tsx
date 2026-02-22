import React, { useState } from 'react';
import { UserPlus, X, Save } from 'lucide-react';
import { useEduMate } from '../context/EduMateContext';

interface SeniorProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SeniorProfileModal({ isOpen, onClose }: SeniorProfileModalProps) {
    const { userName, setUserName, userInterests, setUserInterests, otherInterests, setOtherInterests, aiName, setAiName, generateGreeting, messages } = useEduMate();

    // Local state for the form
    const [localName, setLocalName] = useState(userName);
    const [localAiName, setLocalAiName] = useState(aiName);
    const [localInterests, setLocalInterests] = useState(userInterests || 'Familia');
    const [localOtherInterests, setLocalOtherInterests] = useState(otherInterests || '');
    const [responseSpeed, setResponseSpeed] = useState(50);
    const [detailLevel, setDetailLevel] = useState(50);
    const [questionFrequency, setQuestionFrequency] = useState(50);

    if (!isOpen) return null;

    const handleSave = () => {
        setUserName(localName);
        setAiName(localAiName);
        setUserInterests(localInterests);
        setOtherInterests(localOtherInterests);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-emerald-50/50">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 p-3 rounded-2xl">
                            <UserPlus className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Mi Perfil</h2>
                            <p className="text-base text-slate-500 font-medium tracking-wide">Cuéntanos un poco sobre ti</p>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8">

                    {/* Basic Info */}
                    <section className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-lg font-bold text-slate-700 block">¿Cómo quieres que se llame tu acompañante virtual?</label>
                            <input
                                type="text"
                                value={localAiName}
                                onChange={(e) => setLocalAiName(e.target.value)}
                                placeholder="Ej: Paco, María, Compañero..."
                                className="w-full text-xl bg-white border-2 border-emerald-200 text-slate-800 font-semibold rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-lg font-bold text-slate-700 block">¿Cómo te llamas?</label>
                            <input
                                type="text"
                                value={localName}
                                onChange={(e) => setLocalName(e.target.value)}
                                placeholder="Tu nombre..."
                                className="w-full text-xl bg-white border-2 border-slate-200 text-slate-800 font-semibold rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-lg font-bold text-slate-700 block">Tema de Interés Principal</label>
                            <div className="relative">
                                <select
                                    value={localInterests}
                                    onChange={(e) => setLocalInterests(e.target.value)}
                                    className="w-full text-xl appearance-none bg-white border-2 border-slate-200 text-slate-800 font-semibold rounded-2xl px-5 py-4 pr-10 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer shadow-sm"
                                >
                                    <option value="Noticias">📰 Noticias</option>
                                    <option value="Historia">🏛️ Historia</option>
                                    <option value="Juegos">🎲 Juegos</option>
                                    <option value="Familia">👨‍👩‍👧‍👦 Familia</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-lg font-bold text-slate-700 block">Otros Intereses (Opcional)</label>
                            <input
                                type="text"
                                value={localOtherInterests}
                                onChange={(e) => setLocalOtherInterests(e.target.value)}
                                placeholder="Ej. Jardinería, Cocina, Películas clásicas..."
                                className="w-full text-xl bg-white border-2 border-slate-200 text-slate-800 font-semibold rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                            />
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Preferences Sliders */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-700 mb-4">Preferencias de Conversación</h3>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <div className="flex justify-between text-base font-semibold">
                                    <span className="text-slate-700">Velocidad de Respuesta</span>
                                </div>
                                <input
                                    type="range" min="0" max="100" value={responseSpeed}
                                    onChange={(e) => setResponseSpeed(Number(e.target.value))}
                                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Pausada</span>
                                    <span>Rápida</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-base font-semibold">
                                    <span className="text-slate-700">Nivel de Detalle</span>
                                </div>
                                <input
                                    type="range" min="0" max="100" value={detailLevel}
                                    onChange={(e) => setDetailLevel(Number(e.target.value))}
                                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Resumido</span>
                                    <span>Detallado</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-base font-semibold">
                                    <span className="text-slate-700">Frecuencia de Preguntas</span>
                                </div>
                                <input
                                    type="range" min="0" max="100" value={questionFrequency}
                                    onChange={(e) => setQuestionFrequency(Number(e.target.value))}
                                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Pocas</span>
                                    <span>Muchas</span>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3 mt-auto">
                    <button
                        onClick={handleSave}
                        disabled={!localName.trim()}
                        className="w-full py-4 text-xl bg-emerald-600 text-white rounded-2xl font-bold shadow-md hover:bg-emerald-700 transition-all hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-6 h-6" />
                        Guardar Perfil
                    </button>
                </div>

            </div>
        </div>
    );
}
