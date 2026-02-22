'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEduMate } from '../context/EduMateContext';
import { Send, UserCircle, User, Loader2, Bell, Pill, Calendar, CheckSquare } from 'lucide-react';

export default function ChatInterface() {
    const { messages, sendMessage, generateGreeting, userName, aiName, activeAlerts, dismissAlert, addSystemMessage } = useEduMate();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (messages.length === 0 && userName) {
            generateGreeting();
        }
    }, [messages.length, userName, generateGreeting]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-5 flex items-center gap-4 shadow-sm z-10 shrink-0">
                <div className="bg-emerald-100/80 p-2.5 rounded-xl">
                    <UserCircle className="w-8 h-8 text-emerald-700" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-2xl">{aiName}</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <p className="text-sm font-medium text-slate-500">En línea y listo para hablar</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-6 animate-in fade-in duration-700">
                        <div className="bg-slate-100 p-8 rounded-full inline-block">
                            <UserCircle className="w-16 h-16 text-slate-300" />
                        </div>
                        <p className="text-2xl font-medium text-slate-500 text-center max-w-lg">
                            ¡Hola! Soy {aiName}. Estoy aquí para charlar contigo sobre el tema que prefieras.
                        </p>
                    </div>
                ) : (
                    messages.filter(msg => !msg.content.startsWith('INSTRUCCIÓN DE SISTEMA:')).map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-4 animate-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            {/* Avatar */}
                            <div
                                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-white border-2 text-emerald-600 border-emerald-200'
                                    }`}
                            >
                                {msg.role === 'user' ? (
                                    <User className="w-6 h-6" />
                                ) : (
                                    <UserCircle className="w-7 h-7" />
                                )}
                            </div>

                            {/* Message Bubble - text-2xl as requested */}
                            <div
                                className={`max-w-[85%] px-6 py-5 shadow-sm text-2xl ${msg.role === 'user'
                                    ? 'bg-teal-600 text-white rounded-[2rem] rounded-br-md font-medium'
                                    : 'bg-white border-2 border-slate-200 text-slate-800 rounded-[2rem] rounded-bl-md font-normal font-sans'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap leading-[1.6]">{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}

                {/* Active Alerts Banners */}
                {activeAlerts.length > 0 && (
                    <div className="space-y-4 pt-4 border-t-2 border-slate-100">
                        {activeAlerts.map(alert => (
                            <div key={alert.id} className={`p-6 rounded-3xl shadow-sm border-2 animate-in slide-in-from-bottom-2 ${alert.type === 'medication' ? 'bg-rose-100 border-rose-200 text-rose-900' : 'bg-indigo-100 border-indigo-200 text-indigo-900'}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full shrink-0 ${alert.type === 'medication' ? 'bg-rose-200 text-rose-700' : 'bg-indigo-200 text-indigo-700'}`}>
                                        {alert.type === 'medication' ? <Pill className="w-8 h-8" /> : <Calendar className="w-8 h-8" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-3xl font-black mb-2">{alert.title}</h4>
                                        <p className="text-2xl whitespace-pre-wrap font-medium leading-relaxed">{alert.message}</p>

                                        <div className="mt-6">
                                            {alert.type === 'medication' ? (
                                                <button
                                                    onClick={() => {
                                                        dismissAlert(alert.id);
                                                        const timeSplitStr = alert.id.split('-');
                                                        const takenTime = timeSplitStr.length > 2 ? timeSplitStr[2] : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                        sendMessage(`¡Hola! Ya me he tomado mi medicina de las ${takenTime}.`);
                                                    }}
                                                    className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white text-2xl font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-md active:scale-95"
                                                >
                                                    <CheckSquare className="w-7 h-7" />
                                                    Ya me la he tomado
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => dismissAlert(alert.id)}
                                                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-2xl font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-md active:scale-95"
                                                >
                                                    <CheckSquare className="w-7 h-7" />
                                                    Entendido
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200 z-10 shrink-0">
                <form onSubmit={handleSend} className="flex gap-4 max-w-5xl mx-auto items-end">
                    <div className="relative flex-1">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            placeholder="Escribe tu mensaje aquí..."
                            className="w-full text-2xl bg-slate-50 border-2 border-slate-200 text-slate-800 rounded-[2rem] pl-6 pr-4 py-5 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none min-h-[72px] max-h-48 overflow-y-auto"
                            rows={1}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="h-[72px] px-8 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none text-white text-xl font-bold rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-xl flex-shrink-0"
                    >
                        <Send className="w-8 h-8 mr-0 sm:mr-3" />
                        <span className="hidden sm:inline">Enviar</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
