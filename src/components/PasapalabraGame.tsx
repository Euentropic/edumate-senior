'use client';

import React, { useState, useEffect } from 'react';
import { useEduMate } from '../context/EduMateContext';
import { PASAPALABRA_BANK } from '../data/pasapalabraBank';
import { getPasapalabraTurn } from '../services/pasapalabraService';
import { PlayCircle, Check, X, RotateCcw, Timer } from 'lucide-react';
import { normalizeSpanishWord } from '../utils/textUtils';
import { addPlayedWordToHistory } from '../services/wordService';

type LetterStatus = 'pending' | 'current' | 'correct' | 'incorrect';

type LetterState = {
    letter: string;
    type: 'Empieza por' | 'Contiene';
    status: LetterStatus;
    word?: string;
    definition?: string;
};

const INITIAL_LETTERS: LetterState[] = PASAPALABRA_BANK.map(item => ({
    letter: item.letter,
    type: item.type,
    status: 'pending'
}));

export default function PasapalabraGame() {
    const { updateUserStats } = useEduMate();

    const [letters, setLetters] = useState<LetterState[]>(INITIAL_LETTERS);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [inputValue, setInputValue] = useState('');
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
    const [isLoading, setIsLoading] = useState(false);

    // Timer & Feedback State
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [solutionMessage, setSolutionMessage] = useState<string | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && !isLoading && !solutionMessage) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, isLoading, solutionMessage, currentIndex]);

    const handleTimeout = () => {
        handlePasapalabra();
    };

    const correctCount = letters.filter(l => l.status === 'correct').length;
    const incorrectCount = letters.filter(l => l.status === 'incorrect').length;

    const startGame = async () => {
        setLetters(INITIAL_LETTERS);
        setCurrentIndex(0);
        setGameState('playing');
        setInputValue('');
        setSolutionMessage(null);
        await loadTurn(0, INITIAL_LETTERS);
    };

    const handleExitGame = () => {
        setGameState('idle');
        setLetters(INITIAL_LETTERS);
        setCurrentIndex(0);
        setInputValue('');
        setSolutionMessage(null);
    };

    const loadTurn = async (index: number, currentLetters: LetterState[]) => {
        setIsLoading(true);
        const item = currentLetters[index];

        let newLetters = [...currentLetters];

        if (!item.word) {
            const turnData = await getPasapalabraTurn({ letter: item.letter, type: item.type });
            newLetters[index] = {
                ...newLetters[index],
                word: turnData.word,
                definition: turnData.definition,
                status: 'current'
            };
        } else {
            newLetters[index].status = 'current';
        }

        setLetters(newLetters);
        setIsLoading(false);
        setTimeLeft(30);
    };

    const handleAnswer = async () => {
        if (!inputValue.trim() || gameState !== 'playing' || isLoading || solutionMessage) return;

        const currentLetter = letters[currentIndex];
        const isCorrect = normalizeSpanishWord(inputValue.trim()) === normalizeSpanishWord(currentLetter.word || '');

        if (isCorrect) {
            const newLetters = [...letters];
            newLetters[currentIndex].status = 'correct';
            setLetters(newLetters);
            setInputValue('');
            if (currentLetter.word) {
                addPlayedWordToHistory(currentLetter.word);
            }
            await advanceToNextPending(newLetters);
        } else {
            setInputValue(''); // Limpia el input inmediatamente
            setSolutionMessage(`La respuesta era: ${currentLetter.word}`);
            setTimeout(async () => {
                const newLetters = [...letters];
                newLetters[currentIndex].status = 'incorrect';
                setLetters(newLetters);
                setSolutionMessage(null);
                await advanceToNextPending(newLetters);
            }, 5000); // 5 segundos de feedback
        }
    };

    const handlePasapalabra = async () => {
        if (gameState !== 'playing' || isLoading || solutionMessage) return;

        const newLetters = [...letters];
        newLetters[currentIndex].status = 'pending';
        setLetters(newLetters);
        setInputValue('');

        await advanceToNextPending(newLetters);
    };

    const advanceToNextPending = async (currentLetters: LetterState[]) => {
        let nextIndex = currentIndex + 1;
        let found = false;

        for (let i = 0; i < currentLetters.length; i++) {
            const checkIndex = (nextIndex + i) % currentLetters.length;
            if (currentLetters[checkIndex].status === 'pending') {
                setCurrentIndex(checkIndex);
                found = true;
                await loadTurn(checkIndex, currentLetters);
                break;
            }
        }

        if (!found) {
            setGameState('ended');
            const totalCorrect = currentLetters.filter(l => l.status === 'correct').length;
            updateUserStats(totalCorrect >= 15);
        }
    };

    if (gameState === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-in zoom-in-95 duration-500">
                <div className="bg-white p-10 rounded-3xl border-2 border-indigo-100 text-center w-full max-w-lg shadow-sm">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <PlayCircle className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 mb-4">Pasapalabra</h2>
                    <p className="text-xl text-slate-500 mb-8 font-medium">Completa el rosco descubriendo la palabra que se esconde detrás de cada letra y su definición.</p>
                    <button onClick={startGame} className="px-8 py-5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-white text-2xl shadow-md w-full transition-transform active:scale-95">
                        ¡Comenzar Rosco!
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'ended') {
        const isWon = correctCount >= 15;
        return (
            <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-in zoom-in-95 duration-500">
                <div className={`p-10 rounded-3xl border-2 text-center w-full max-w-lg shadow-sm ${isWon ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <h4 className="text-4xl font-black mb-4">{isWon ? '¡Gran trabajo! 🎉' : '¡Fin del rosco! 👏'}</h4>
                    <div className="flex justify-center gap-6 my-6">
                        <div className="text-center">
                            <span className="block text-4xl font-black text-emerald-600">{correctCount}</span>
                            <span className="text-sm uppercase font-bold text-emerald-800">Aciertos</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-4xl font-black text-rose-600">{incorrectCount}</span>
                            <span className="text-sm uppercase font-bold text-rose-800">Fallos</span>
                        </div>
                    </div>
                    <button onClick={startGame} className={`px-8 py-5 rounded-2xl font-bold text-white text-2xl shadow-md w-full transition-transform active:scale-95 flex items-center justify-center gap-3 ${isWon ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
                        <RotateCcw className="w-6 h-6" /> Jugar Otra Vez
                    </button>
                </div>
            </div>
        );
    }

    const currentItem = letters[currentIndex];

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-2 sm:p-4 space-y-2 sm:space-y-3 animate-in fade-in duration-500 max-h-[55vh] justify-between overflow-hidden">

            {/* Top Letters Panel (Compact) */}
            <div className="bg-white p-2 md:p-3 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0 z-20">
                <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
                    {letters.map((l, i) => {
                        let bgColor = 'bg-slate-100 text-slate-400 border-slate-200'; // pending
                        if (l.status === 'current') bgColor = 'bg-indigo-500 text-white border-indigo-600 shadow-xl scale-110 z-10';
                        if (l.status === 'correct') bgColor = 'bg-emerald-500 text-white border-emerald-600';
                        if (l.status === 'incorrect') bgColor = 'bg-rose-500 text-white border-rose-600';

                        return (
                            <div key={l.letter} className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full font-bold text-[10px] md:text-sm border-2 transition-all ${bgColor}`}>
                                {l.letter}
                            </div>
                        );
                    })}
                </div>
                <div className="mt-2 flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-wider px-2">
                    <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> {correctCount} aciertos</span>
                    <span className="text-rose-600 flex items-center gap-1"><X className="w-3 h-3" /> {incorrectCount} fallos</span>
                </div>
            </div>

            {/* Central Play Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-between p-3 sm:p-5 relative overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full w-full animate-pulse">
                        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-3"></div>
                        <p className="text-lg font-bold text-slate-600">Preparando letra...</p>
                    </div>
                ) : (
                    <>
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <span className="text-[6rem] sm:text-[8rem] font-black leading-none">{currentItem.letter}</span>
                        </div>

                        {/* Top controls: Timer & Exit */}
                        <div className="w-full flex justify-between items-center mb-2 relative z-20">
                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-600'}`} />
                                <span className={`text-xl font-black tabular-nums ${timeLeft <= 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                                    {timeLeft}
                                </span>
                            </div>

                            <button
                                onClick={handleExitGame}
                                className="flex items-center gap-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-full border border-rose-200 shadow-sm transition-all active:scale-95 font-bold text-sm"
                            >
                                <X className="w-4 h-4" />
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </div>

                        {/* Main Content container (Letter, Condition, Definition) */}
                        <div className="w-full flex flex-col items-center justify-center flex-1 space-y-2 sm:space-y-3 z-10 m-1">
                            {/* Letter + Condition Row */}
                            <div className="flex items-center justify-center gap-3">
                                <h3 className="text-4xl sm:text-5xl font-black text-indigo-600 leading-none">{currentItem.letter}</h3>
                                <div className={`px-3 py-1 rounded-lg font-black text-xs md:text-sm uppercase tracking-wider shadow-sm border-2 ${currentItem.type === 'Empieza por'
                                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                                    }`}>
                                    {currentItem.type === 'Empieza por' ? `EMPIEZA POR LA ${currentItem.letter}` : `CONTIENE LA ${currentItem.letter}`}
                                </div>
                            </div>

                            <p className="text-base md:text-lg text-slate-700 text-center font-medium leading-tight sm:leading-snug bg-slate-50 p-3 rounded-xl w-full border border-slate-100 max-w-2xl overflow-y-auto max-h-[15vh]">
                                {currentItem.definition}
                            </p>
                        </div>

                        {/* Input and Buttons Form */}
                        <form className="w-full max-w-2xl flex flex-col gap-2 sm:gap-3 z-10" onSubmit={(e) => { e.preventDefault(); handleAnswer(); }}>

                            <div className="w-full h-[55px] sm:h-[70px]">
                                {solutionMessage ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-rose-100 border-4 border-rose-200 rounded-xl animate-in zoom-in-95 px-4 text-center shadow-inner">
                                        <p className="text-base sm:text-lg font-bold text-rose-800 leading-tight">
                                            <span className="font-black">¡Oh!</span> {solutionMessage}
                                        </p>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={e => setInputValue(e.target.value)}
                                        placeholder="Escribe tu respuesta aquí..."
                                        disabled={!!solutionMessage}
                                        className="w-full h-full text-center text-lg sm:text-xl font-bold uppercase text-slate-800 bg-white border-4 border-slate-200 px-4 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300 placeholder:normal-case placeholder:font-medium shadow-sm"
                                        autoFocus
                                        autoComplete="off"
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
                                <button
                                    type="button"
                                    onClick={handlePasapalabra}
                                    disabled={!!solutionMessage}
                                    className="py-2.5 sm:py-3 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-amber-950 font-black text-base sm:text-lg rounded-xl transition-all active:scale-95 shadow-sm border-b-4 border-amber-600 flex items-center justify-center"
                                >
                                    PASAPALABRA
                                </button>
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || !!solutionMessage}
                                    className="py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:border-indigo-400 disabled:border-b-4 disabled:translate-y-0 text-white font-black text-base sm:text-lg rounded-xl transition-all active:scale-95 shadow-sm border-b-4 border-indigo-800 flex items-center justify-center"
                                >
                                    COMPROBAR
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>

        </div>
    );
}
