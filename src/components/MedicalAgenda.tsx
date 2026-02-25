import React, { useState } from 'react';
import { Shield, Bell, Clock, Award, Pill, Calendar, Plus, Trash2, CalendarHeart, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEduMate } from '../context/EduMateContext';

export default function MedicalAgenda() {
    const { medications, addMedication, removeMedication, appointments, addAppointment, removeAppointment } = useEduMate();

    // Meds local state
    const [medName, setMedName] = useState('');
    const [medDose, setMedDose] = useState('');
    const [medDesc, setMedDesc] = useState('');
    const [medTimes, setMedTimes] = useState<string[]>(['']);
    const [medDosesPerDay, setMedDosesPerDay] = useState<number>(1);
    const [medObs, setMedObs] = useState('');

    // Apps local state
    const [appDoc, setAppDoc] = useState('');
    const [appLoc, setAppLoc] = useState('');
    const [appDate, setAppDate] = useState('');

    // Calendar local state
    const [currentDate, setCurrentDate] = useState(new Date());

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDosesChange = (val: number) => {
        const doses = isNaN(val) ? 1 : Math.max(1, Math.min(10, val));
        setMedDosesPerDay(doses);
        setMedTimes(prev => {
            const newTimes = [...prev];
            if (newTimes.length < doses) {
                while (newTimes.length < doses) newTimes.push('');
            } else if (newTimes.length > doses) {
                newTimes.length = doses;
            }
            return newTimes;
        });
    };

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...medTimes];
        newTimes[index] = value;
        setMedTimes(newTimes);
    };

    const handleAddMed = (e: React.FormEvent) => {
        e.preventDefault();
        const validTimes = medTimes.filter(t => t.trim() !== '');
        if (!medName || validTimes.length === 0) return;

        addMedication({
            name: medName,
            dose: medDose || '1 unidad',
            descripcionVisual: medDesc,
            times: validTimes,
            dosesPerDay: medDosesPerDay,
            observaciones: medObs
        });
        setMedName(''); setMedDose(''); setMedDesc(''); setMedTimes(['']); setMedDosesPerDay(1); setMedObs('');
    };

    const handleAddApp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!appDoc || !appDate) return;

        addAppointment({
            doctor: appDoc,
            location: appLoc || 'Consulta',
            datetime: appDate
        });
        setAppDoc(''); setAppLoc(''); setAppDate('');
    };

    return (
        <div className="flex flex-col h-full space-y-6 overflow-y-auto pb-8">
            {/* Header (No white box, just floating above) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-3 rounded-xl">
                        <Shield className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Agenda Médica</h2>
                        <p className="text-lg text-slate-500 font-medium">Gestión técnica, médica y de seguimiento</p>
                    </div>
                </div>
            </div>

            <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

                {/* COLUMN 1: Medicación */}
                <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
                            <Pill className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Medicación</h3>
                    </div>

                    <form onSubmit={handleAddMed} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Nombre</label>
                                <input required value={medName} onChange={e => setMedName(e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2" placeholder="Ej: Sintrom" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Tomas al día</label>
                                <input required type="number" min="1" max="10" value={medDosesPerDay} onChange={e => handleDosesChange(parseInt(e.target.value))} className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Dosis</label>
                                <input value={medDose} onChange={e => setMedDose(e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2" placeholder="Ej: Medio comprimido" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Forma Visual</label>
                                <input value={medDesc} onChange={e => setMedDesc(e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2" placeholder="Ej: Blanca cruzada" />
                            </div>
                        </div>
                        {medTimes.length > 0 && (
                            <div className={`grid gap-4 ${medTimes.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                {medTimes.map((t, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 uppercase">Hora Toma {idx + 1}</label>
                                        <input required type="time" value={t} onChange={e => handleTimeChange(idx, e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Observaciones</label>
                            <input value={medObs} onChange={e => setMedObs(e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2" placeholder="Ej: Tomar en ayunas" />
                        </div>
                        <button type="submit" disabled={!medName || medTimes.filter(t => t.trim() !== '').length === 0} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Añadir Medicina
                        </button>
                    </form>

                    <div className="mt-4">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">En Uso</h4>
                        <div className="space-y-3">
                            {medications.length === 0 ? (
                                <p className="text-base text-slate-400 text-center py-4 font-medium bg-slate-50 rounded-xl border border-slate-100 italic">No hay medicamentos.</p>
                            ) : (
                                medications.map(med => (
                                    <div key={med.id} className="flex justify-between items-start p-4 rounded-xl border border-rose-100 bg-rose-50/20 shadow-sm transition-all">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-slate-800">{med.name}</span>
                                                <span className="text-sm bg-white text-rose-700 px-3 py-1 rounded-lg font-bold border border-rose-100 shadow-sm tabular-nums">
                                                    {med.dosesPerDay} tomas diarias ({med.times?.join(', ')})
                                                </span>
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-base text-slate-700">
                                                    <strong>Dosis:</strong> {med.dose} {med.descripcionVisual ? `(${med.descripcionVisual})` : ''}
                                                </p>
                                                {med.observaciones && (
                                                    <p className="inline-flex text-sm text-emerald-800 font-medium bg-emerald-100/50 rounded-lg px-3 py-1 mt-1">
                                                        📝 {med.observaciones}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => removeMedication(med.id)} className="ml-3 p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shadow-sm" aria-label="Borrar">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: Citas Médicas */}
                <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <CalendarHeart className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Citas Médicas</h3>
                    </div>

                    <form onSubmit={handleAddApp} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Especialista / Médico</label>
                            <input required value={appDoc} onChange={e => setAppDoc(e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2" placeholder="Ej: Dr. García (Cardiología)" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Lugar</label>
                            <input value={appLoc} onChange={e => setAppLoc(e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2" placeholder="Ej: Hospital Central, Planta 2" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Fecha y Hora</label>
                            <input required type="datetime-local" value={appDate} onChange={e => setAppDate(e.target.value)} className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2" />
                        </div>
                        <button type="submit" disabled={!appDoc || !appDate} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Programar Cita
                        </button>
                    </form>

                    <div className="mt-4">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Próximas Citas</h4>
                        <div className="space-y-3">
                            {appointments.length === 0 ? (
                                <p className="text-base text-slate-400 text-center py-4 font-medium bg-slate-50 rounded-xl border border-slate-100 italic">No hay citas programadas.</p>
                            ) : (
                                [...appointments].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()).map(app => (
                                    <div key={app.id} className="flex justify-between items-start p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 shadow-sm transition-all">
                                        <div className="flex-1">
                                            <p className="text-lg font-bold text-slate-800">{app.doctor}</p>
                                            <div className="flex items-center gap-1 mt-2 mb-3">
                                                <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">
                                                    <MapPin className="w-4 h-4 text-indigo-500" />
                                                    {app.location}
                                                </span>
                                            </div>
                                            <span className="text-sm bg-white text-indigo-800 border border-indigo-200 px-3 py-2 rounded-xl font-bold shadow-sm inline-block">
                                                🗓️ {new Date(app.datetime).toLocaleString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <button onClick={() => removeAppointment(app.id)} className="ml-3 p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shadow-sm" aria-label="Borrar">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* COLUMN 3: Calendario Visual */}
                <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 capitalize">
                                {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" aria-label="Mes anterior">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" aria-label="Mes siguiente">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                            <div key={day} className="text-xs font-bold text-slate-400 py-1">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                            const dayNum = i + 1;
                            const hasAppointment = appointments.some(app => {
                                const appDate = new Date(app.datetime);
                                return appDate.getDate() === dayNum &&
                                    appDate.getMonth() === currentDate.getMonth() &&
                                    appDate.getFullYear() === currentDate.getFullYear();
                            });

                            return (
                                <div
                                    key={i}
                                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${hasAppointment
                                        ? 'bg-indigo-600 text-white shadow-md cursor-pointer hover:bg-indigo-700 hover:scale-105'
                                        : 'text-slate-600 hover:bg-slate-100 cursor-default'
                                        }`}
                                >
                                    {dayNum}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 font-medium">
                            <div className="w-3 h-3 rounded-full bg-indigo-600 shrink-0"></div>
                            <span>Días con citas médicas programadas</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Resumen del Mes</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {appointments.filter(app => {
                                const appDate = new Date(app.datetime);
                                return appDate.getMonth() === currentDate.getMonth() && appDate.getFullYear() === currentDate.getFullYear();
                            }).length === 0 ? (
                                <p className="text-sm text-slate-400 italic">Mes libre de citas.</p>
                            ) : (
                                [...appointments].filter(app => {
                                    const appDate = new Date(app.datetime);
                                    return appDate.getMonth() === currentDate.getMonth() && appDate.getFullYear() === currentDate.getFullYear();
                                }).sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()).map(app => (
                                    <div key={app.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm flex justify-between items-center">
                                        <p className="font-bold text-slate-800 truncate pr-2">{app.doctor}</p>
                                        <p className="text-indigo-600 font-semibold shrink-0">{new Date(app.datetime).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
