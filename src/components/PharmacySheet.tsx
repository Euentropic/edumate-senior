import React from 'react';
import { Pill, Copy, CheckCircle2 } from 'lucide-react';
import { useEduMate } from '../context/EduMateContext';

export default function PharmacySheet() {
    const { medications } = useEduMate();
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        const text = medications.map(m => `- ${m.name}: ${m.dose} (${m.dosesPerDay} tomas diarias: ${m.times?.join(', ')})`).join('\n');
        navigator.clipboard.writeText(`Mi Hoja de Medicación Actualizada:\n\n${text}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-8 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-rose-100 p-4 rounded-2xl">
                        <Pill className="w-10 h-10 text-rose-600" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Hoja de Farmacia</h2>
                        <p className="text-xl text-slate-500 font-medium mt-1">Tu medicación actual simplificada para consultas</p>
                    </div>
                </div>

                <button
                    onClick={handleCopy}
                    disabled={medications.length === 0}
                    className="py-4 px-8 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-xl transition-all shadow-md flex items-center gap-3 disabled:opacity-50 active:scale-95"
                >
                    {copied ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
                    {copied ? '¡Copiada!' : 'Copiar Listado'}
                </button>
            </div>

            <div className="flex-1 max-w-4xl pt-4">
                {medications.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Pill className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-2xl text-slate-500 font-medium">No hay medicación activa registrada.</p>
                        <p className="text-lg text-slate-400 mt-2">Añade medicamentos desde la Agenda Médica.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {medications.map(med => (
                            <div key={med.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-rose-100 hover:bg-rose-50/30 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-3xl font-bold text-slate-800">{med.name}</p>
                                    <p className="text-2xl text-slate-600 font-medium">{med.dose}</p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 shadow-sm inline-block mb-2">
                                        <span className="text-lg font-bold text-slate-700">{med.dosesPerDay} tomas diarias</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        {med.times?.map((t, i) => (
                                            <span key={i} className="bg-rose-100 text-rose-700 border border-rose-200 rounded-lg px-4 py-2 font-bold text-xl tabular-nums shadow-sm">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
