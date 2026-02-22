'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { aiService } from '../services/aiService';

export type LearningProfileType = 'Estándar' | 'TDAH' | 'Dislexia' | 'Altas Capacidades';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface Medication {
    id: string;
    name: string;
    dose: string;
    descripcionVisual: string;
    time: string; // HH:MM
    observaciones: string;
}

export interface MedicalAppointment {
    id: string;
    doctor: string;
    location: string;
    datetime: string; // YYYY-MM-DDTHH:MM
}

export interface ActiveAlert {
    id: string;
    type: 'medication' | 'appointment';
    title: string;
    message: string;
}

export interface EduMateContextState {
    userName: string;
    setUserName: (name: string) => void;
    userInterests: string;
    setUserInterests: (interests: string) => void;
    otherInterests: string;
    setOtherInterests: (interests: string) => void;
    aiName: string;
    setAiName: (name: string) => void;
    messages: Message[];
    isModelLoaded: boolean;
    loadingProgress: number;
    learningProfile: LearningProfileType;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    initializeAI: () => Promise<void>;
    sendMessage: (text: string) => Promise<void>;
    clearChat: () => void;
    updateLearningProfile: (profile: LearningProfileType) => void;
    addSystemMessage: (text: string) => void;
    generateGreeting: () => Promise<void>;
    startCognitiveActivity: (activityName: string) => Promise<void>;
    medications: Medication[];
    addMedication: (med: Omit<Medication, 'id'>) => void;
    removeMedication: (id: string) => void;
    appointments: MedicalAppointment[];
    addAppointment: (app: Omit<MedicalAppointment, 'id'>) => void;
    removeAppointment: (id: string) => void;
    activeAlerts: ActiveAlert[];
    dismissAlert: (id: string) => void;
}

const EduMateContext = createContext<EduMateContextState | undefined>(undefined);

export const EduMateProvider = ({ children }: { children: ReactNode }) => {
    const [userName, setUserName] = useState<string>('');
    const [userInterests, setUserInterests] = useState<string>('Familia');
    const [otherInterests, setOtherInterests] = useState<string>('');
    const [aiName, setAiName] = useState<string>('Compañero');
    const [learningProfile, setLearningProfile] = useState<LearningProfileType>('Estándar');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isModelLoaded, setIsModelLoaded] = useState<boolean>(true);
    const [loadingProgress, setLoadingProgress] = useState<number>(0);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('tutor');

    const [medications, setMedications] = useState<Medication[]>([]);
    const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
    const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([]);
    const alertedInstances = React.useRef<Set<string>>(new Set());

    const addMedication = useCallback((med: Omit<Medication, 'id'>) => {
        setMedications(prev => [...prev, { ...med, id: Date.now().toString() + Math.random().toString(36).substring(7) }]);
    }, []);

    const removeMedication = useCallback((id: string) => {
        setMedications(prev => prev.filter(m => m.id !== id));
    }, []);

    const addAppointment = useCallback((app: Omit<MedicalAppointment, 'id'>) => {
        setAppointments(prev => [...prev, { ...app, id: Date.now().toString() + Math.random().toString(36).substring(7) }]);
    }, []);

    const removeAppointment = useCallback((id: string) => {
        setAppointments(prev => prev.filter(a => a.id !== id));
    }, []);

    const dismissAlert = useCallback((id: string) => {
        setActiveAlerts(prev => prev.filter(a => a.id !== id));
    }, []);

    React.useEffect(() => {
        const checkSchedules = () => {
            const now = new Date();
            const currentHours = now.getHours().toString().padStart(2, '0');
            const currentMinutes = now.getMinutes().toString().padStart(2, '0');
            const currentTimeStr = `${currentHours}:${currentMinutes}`;
            const currentDateStr = now.toLocaleDateString();

            // 1. Group medications by time
            const medsToTakeNow = medications.filter(m => m.time === currentTimeStr);
            if (medsToTakeNow.length > 0) {
                const uniqueId = `meds-${currentDateStr}-${currentTimeStr}`;
                if (!alertedInstances.current.has(uniqueId)) {
                    alertedInstances.current.add(uniqueId);

                    const namesList = medsToTakeNow.map(m => `💊 **${m.name}** (${m.dose}, ${m.descripcionVisual})`).join('\n');
                    const notesList = medsToTakeNow.filter(m => m.observaciones).map(m => `- ${m.name}: ${m.observaciones}`).join('\n');

                    const alertMsg = `Es hora de tus medicinas:\n\n${namesList}${notesList ? `\n\nNotas:\n${notesList}` : ''}`;

                    setActiveAlerts(prev => [...prev, {
                        id: uniqueId,
                        type: 'medication',
                        title: '🚨 Recordatorio de Salud',
                        message: alertMsg
                    }]);
                }
            }

            // 2. Check appointments (24h and 3h before)
            appointments.forEach(app => {
                const appDate = new Date(app.datetime);
                const diffMs = appDate.getTime() - now.getTime();
                const diffHours = diffMs / (1000 * 60 * 60);

                if (diffHours > 0) {
                    let alertType = null;
                    if (diffHours <= 24.1 && diffHours >= 23.9) alertType = '24h';
                    if (diffHours <= 3.1 && diffHours >= 2.9) alertType = '3h';

                    if (alertType) {
                        const uniqueId = `app-${app.id}-${alertType}`;
                        if (!alertedInstances.current.has(uniqueId)) {
                            alertedInstances.current.add(uniqueId);
                            setActiveAlerts(prev => [...prev, {
                                id: uniqueId,
                                type: 'appointment',
                                title: `📅 Recordatorio de Cita Médica (${alertType === '24h' ? 'Mañana' : 'En 3 horas'})`,
                                message: `Tienes visita con **${app.doctor}** en **${app.location}** a las ${appDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
                            }]);
                        }
                    }
                }
            });
        };

        const interval = setInterval(checkSchedules, 10000); // Poll every 10s
        checkSchedules();
        return () => clearInterval(interval);
    }, [medications, appointments]);

    const clearChat = useCallback(() => {
        setMessages([]);
    }, []);

    const updateLearningProfile = useCallback((profile: LearningProfileType) => {
        setLearningProfile(profile);
        setMessages([]);
    }, []);

    const initializeAI = useCallback(async () => {
        try {
            setLoadingProgress(0);
            setIsModelLoaded(false);

            await aiService.initModel('llama-3.1-8b-instant', (report) => {
                setLoadingProgress(Math.round(report.progress * 100));
            });

            setIsModelLoaded(true);
            setLoadingProgress(100);
        } catch (error) {
            console.error('Error inicializando el motor de IA en la nube:', error);
            setIsModelLoaded(false);
            setLoadingProgress(0);
        }
    }, []);

    const addSystemMessage = useCallback((text: string) => {
        setMessages((prev) => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: text,
            timestamp: Date.now()
        }]);
    }, []);

    const generateGreeting = useCallback(async () => {
        if (isGenerating || !userName) return;
        setIsGenerating(true);
        try {
            const prompt = `Eres un compañero virtual diseñado para acompañar a personas mayores. Tu nombre es ${aiName}.
Regla de Oro: Inicia la interacción saludando a ${userName} de forma muy cálida y presentándote como ${aiName}. Menciona que te encantaría hablar sobre ${userInterests} o sobre su otro interés: ${otherInterests || 'cualquier tema que le guste'}. Termina con una pregunta abierta para empezar a charlar. Usa emojis. No uses párrafos largos.`;

            const apiMessages = [{ role: 'system', content: prompt }] as const;
            // @ts-ignore
            const responseText = await aiService.generate(apiMessages);

            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: Date.now(),
            }]);
        } catch (error) {
            console.error('Error generando saludo:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [isGenerating, userName, userInterests, otherInterests, aiName]);

    const startCognitiveActivity = useCallback(async (activityName: string) => {
        if (isGenerating || !userName) return;

        setActiveTab('tutor');
        setMessages([]); // Clear chat for focused activity
        setIsGenerating(true);

        try {
            const prompt = `INSTRUCCIÓN DE SISTEMA: El usuario quiere jugar a "${activityName}". Eres un carismático presentador de concursos culturales. Sube el nivel del reto. REGLAS SEGÚN EL JUEGO: Si es "La Palabra Oculta", dale la definición de diccionario de una palabra culta y la letra por la que empieza. Si es "Anagramas", dale una palabra de 7 letras con las letras desordenadas para que adivine la original. Si es "Cálculo Encadenado", dale 3 operaciones seguidas (ej: empieza en 50, réstale 15, divídelo entre 5... ¿qué da?). DETENTE tras proponer el reto. NUNCA des la respuesta en el mismo mensaje. Si falla, dale la primera letra como pista.`;

            const apiMessages = [{ role: 'system', content: prompt }] as const;
            // @ts-ignore
            const responseText = await aiService.generate(apiMessages);

            setMessages([{
                id: Date.now().toString(),
                role: 'assistant',
                content: responseText,
                timestamp: Date.now(),
            }]);
        } catch (error) {
            console.error('Error iniciando actividad cognitiva:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [isGenerating, userName]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isGenerating) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsGenerating(true);

        try {
            const todayStr = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            const appsStr = appointments.length > 0
                ? appointments.map(app => `- ${new Date(app.datetime).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}: ${app.doctor} en ${app.location}`).join('\n')
                : 'Ninguna cita programada.';

            let systemPrompt = `Eres un compañero virtual diseñado para acompañar a personas mayores. Tu nombre es ${aiName}.
Regla de Oro:
- Debes dirigirte al usuario por su nombre: ${userName || 'Amigo'}.
- SIEMPRE debes terminar tu respuesta con una pregunta abierta relacionada con el tema de interés del usuario: ${userInterests} o ${otherInterests || 'cualquier afición que tenga'}.
- Eres cálido, paciente y muy amigable. Usa siempre un lenguaje respetuoso.
- Utiliza párrafos cortos y fáciles de leer.
- Utiliza emojis para dar calidez y amabilidad a la conversación 😊.

INFORMACIÓN CRÍTICA DE CONTEXTO: Hoy es ${todayStr}. El usuario tiene estas citas médicas programadas:
${appsStr}

REGLA DE EMPATÍA: Si el usuario te saluda y ves que tiene una cita HOY o MAÑANA, saca tú el tema de forma proactiva y natural. Pregúntale con cariño si tiene todo preparado para ir al Médico, si le acompaña alguien, o si tiene alguna duda apuntada.`;

            const apiMessages = [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: text }
            ] as const;

            // @ts-ignore
            const responseText = await aiService.generate(apiMessages);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error generando respuesta:', error);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Lo siento, hubo un error técnico procesando tu mensaje. ¿Podrías intentarlo de nuevo?',
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsGenerating(false);
        }
    }, [isGenerating, messages, userName, userInterests, otherInterests, appointments, aiName]);

    const value = {
        userName,
        setUserName,
        userInterests,
        setUserInterests,
        otherInterests,
        setOtherInterests,
        aiName,
        setAiName,
        messages,
        isModelLoaded,
        loadingProgress,
        learningProfile,
        activeTab,
        setActiveTab,
        initializeAI,
        sendMessage,
        clearChat,
        updateLearningProfile,
        addSystemMessage,
        generateGreeting,
        startCognitiveActivity,
        medications,
        addMedication,
        removeMedication,
        appointments,
        addAppointment,
        removeAppointment,
        activeAlerts,
        dismissAlert
    };

    return <EduMateContext.Provider value={value}>{children}</EduMateContext.Provider>;
};

export const useEduMate = (): EduMateContextState => {
    const context = useContext(EduMateContext);
    if (context === undefined) {
        throw new Error('useEduMate must be used within an EduMateProvider');
    }
    return context;
};
