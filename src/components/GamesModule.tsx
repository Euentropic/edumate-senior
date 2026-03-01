'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEduMate } from '../context/EduMateContext';
import { Send, UserCircle, User, Gamepad2, FileQuestion, HelpCircle, Trophy, Search } from 'lucide-react';
import { aiService } from '../services/aiService';

const GAMES = [
    { id: 'ahorcado', name: 'El Ahorcado' },
    { id: 'trivial', name: 'Trivial Mental' },
    { id: 'pasapalabra', name: 'Pasapalabra' },
    { id: 'crucigrama', name: 'Crucigrama' },
    { id: 'laberinto', name: 'Laberinto' },
    { id: 'apalabrados', name: 'Apalabrados' },
    { id: 'sopa', name: 'Sopa de Letras' },
];

import { WORDS } from '../data/wordBank';
import { TRIVIAL_QUESTIONS, TrivialQuestion } from '../data/trivialBank';
import { getDynamicWord, getPlayedWordsHistory, addPlayedWordToHistory } from '../services/wordService';
import PasapalabraGame from './PasapalabraGame';
import CrosswordGame from './CrosswordGame';
import MazeGame from './MazeGame';
import ApalabradosGame from './ApalabradosGame';
import SopaDeLetrasGame from './SopaDeLetrasGame';

const HangmanFigure = ({ mistakes }: { mistakes: number }) => {
    return (
        <svg viewBox="0 0 200 250" className="w-32 h-40 md:w-48 md:h-60 stroke-slate-800 fill-none stroke-[4] stroke-linecap-round stroke-linejoin-round mx-auto">
            {/* Structure - always visible */}
            <line x1="20" y1="230" x2="100" y2="230" /> {/* Base */}
            <line x1="60" y1="230" x2="60" y2="20" />  {/* Pole */}
            <line x1="60" y1="20" x2="140" y2="20" />  {/* Top bar */}
            <line x1="140" y1="20" x2="140" y2="50" /> {/* Rope */}

            {/* Parts based on mistakes */}
            {mistakes >= 1 && <circle cx="140" cy="70" r="20" />} {/* Head */}
            {mistakes >= 2 && <line x1="140" y1="90" x2="140" y2="150" />} {/* Body */}
            {mistakes >= 3 && <line x1="140" y1="110" x2="110" y2="140" />} {/* Left Arm */}
            {mistakes >= 4 && <line x1="140" y1="110" x2="170" y2="140" />} {/* Right Arm */}
            {mistakes >= 5 && <line x1="140" y1="150" x2="110" y2="190" />} {/* Left Leg */}
            {mistakes >= 6 && <line x1="140" y1="150" x2="170" y2="190" />} {/* Right Leg */}
        </svg>
    );
};

function HangmanGame() {
    const { updateUserStats } = useEduMate();
    const [word, setWord] = useState('');

    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
    const [mistakes, setMistakes] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [isLoading, setIsLoading] = useState(true);

    const MAX_MISTAKES = 6;

    useEffect(() => {
        initGame();
    }, []);

    const initGame = async () => {
        setIsLoading(true);
        setWord('');

        const currentPlayed = getPlayedWordsHistory();
        const randomWord = await getDynamicWord(currentPlayed);

        addPlayedWordToHistory(randomWord);

        setWord(randomWord);
        setGuessedLetters(new Set());
        setMistakes(0);
        setGameState('playing');
        setIsLoading(false);
    };

    const handleGuess = (letter: string) => {
        if (gameState !== 'playing' || guessedLetters.has(letter)) return;

        const newGuessed = new Set(guessedLetters).add(letter);
        setGuessedLetters(newGuessed);

        if (!word.includes(letter)) {
            const newMistakes = mistakes + 1;
            setMistakes(newMistakes);
            if (newMistakes >= MAX_MISTAKES) {
                setGameState('lost');
                updateUserStats(false);
            }
        } else {
            const isWon = word.split('').every(char => newGuessed.has(char));
            if (isWon) {
                setGameState('won');
                updateUserStats(true);
            }
        }
    };

    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

    return (
        <div className="flex flex-col items-center p-6 h-full w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between w-full items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <Gamepad2 className="w-8 h-8 text-indigo-500" />
                    El Ahorcado
                </h3>
                <div className="flex items-center gap-4">
                    <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                        <span className="text-rose-600 font-bold text-lg">Fallos: {mistakes} / {MAX_MISTAKES}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full gap-6 md:gap-8 overflow-y-auto min-h-0 py-4">

                {/* Hangman Visual Figure */}
                <HangmanFigure mistakes={mistakes} />

                {/* Word Display */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 shadow-sm rounded-2xl animate-pulse">
                        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4"></div>
                        <p className="text-xl font-bold text-slate-600">Generando palabra...</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-3">
                        {word.split('').map((char, index) => (
                            <div key={index} className="w-14 h-16 sm:w-16 sm:h-20 border-b-4 border-slate-800 flex items-center justify-center text-5xl font-black text-slate-800 uppercase bg-slate-50/50 rounded-t-xl">
                                {gameState === 'lost' || guessedLetters.has(char) ? char : ''}
                            </div>
                        ))}
                    </div>
                )}

                {/* Game Over States */}
                {!isLoading && gameState !== 'playing' && (
                    <div className={`p-6 rounded-2xl border-2 text-center w-full max-w-md animate-in zoom-in-95 ${gameState === 'won' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                        <h4 className="text-3xl font-black mb-2">{gameState === 'won' ? '¡Has Ganado! 🎉' : '¡Fin del Juego! 😢'}</h4>
                        {gameState === 'lost' && <p className="text-xl mb-6 font-medium">La palabra era: <span className="font-bold">{word}</span></p>}
                        <button onClick={initGame} className={`px-8 py-4 rounded-xl font-bold text-white text-xl shadow-md w-full transition-transform active:scale-95 ${gameState === 'won' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
                            Jugar de Nuevo
                        </button>
                    </div>
                )}

                {/* Keyboard */}
                {!isLoading && gameState === 'playing' && (
                    <div className="flex flex-wrap justify-center gap-2 max-w-3xl mt-4">
                        {alphabet.map(letter => {
                            const isGuessed = guessedLetters.has(letter);
                            const isCorrect = isGuessed && word.includes(letter);
                            const isWrong = isGuessed && !word.includes(letter);

                            let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300";
                            if (isCorrect) btnClass = "bg-emerald-500 border-emerald-600 text-white opacity-90";
                            if (isWrong) btnClass = "bg-slate-300 border-slate-400 text-slate-500 opacity-50";

                            return (
                                <button
                                    key={letter}
                                    disabled={isGuessed}
                                    onClick={() => handleGuess(letter)}
                                    className={`w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-xl shadow-sm transition-all active:scale-95 disabled:scale-100 ${btnClass}`}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function PlaceholderGame({ name }: { name: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 h-full w-full text-center space-y-6">
            <div className="w-24 h-24 bg-slate-200 rounded-3xl flex items-center justify-center mb-4">
                <FileQuestion className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-4xl font-black text-slate-800">{name}</h2>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-6 py-3 rounded-xl border border-amber-200 font-bold text-xl uppercase tracking-wider">
                🚧 Juego en Desarrollo 🚧
            </div>
            <p className="text-xl text-slate-500 max-w-md mx-auto mt-4 font-medium">
                Estamos trabajando duro para traer este juego en la próxima actualización. ¡Vuelve pronto!
            </p>
        </div>
    );
}

function TrivialGame() {
    const { updateUserStats } = useEduMate();
    const [questions, setQuestions] = useState<TrivialQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'ended'>('playing');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const QUESTIONS_PER_GAME = 10;
    const MIN_SCORE_TO_WIN = 5;

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        // Shuffle the whole bank and pick first 10
        const shuffled = [...TRIVIAL_QUESTIONS].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, QUESTIONS_PER_GAME));
        setCurrentIndex(0);
        setScore(0);
        setGameState('playing');
        setSelectedOption(null);
        setIsAnimating(false);
    };

    const handleAnswer = (option: string) => {
        if (selectedOption || isAnimating || gameState !== 'playing') return;

        setSelectedOption(option);
        setIsAnimating(true);

        const currentQ = questions[currentIndex];
        const isCorrect = option === currentQ.correctAnswer;

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentIndex + 1 < QUESTIONS_PER_GAME) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
                setIsAnimating(false);
            } else {
                setGameState('ended');
                updateUserStats(isCorrect ? score + 1 >= MIN_SCORE_TO_WIN : score >= MIN_SCORE_TO_WIN);
                setIsAnimating(false);
            }
        }, 2000);
    };

    if (questions.length === 0) return null;

    if (gameState === 'ended') {
        const isWon = score >= MIN_SCORE_TO_WIN;
        return (
            <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-in zoom-in-95 duration-500">
                <div className={`p-10 rounded-3xl border-2 text-center w-full max-w-lg shadow-sm ${isWon ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <h4 className="text-4xl font-black mb-4">{isWon ? '¡Felicidades! 🎉' : '¡Buen intento! 👏'}</h4>
                    <p className="text-2xl mb-8 font-medium">Has acertado <span className="font-bold text-3xl">{score}</span> de {QUESTIONS_PER_GAME}</p>
                    <button onClick={initGame} className={`px-8 py-5 rounded-2xl font-bold text-white text-2xl shadow-md w-full transition-transform active:scale-95 ${isWon ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
                        Jugar Otra Vez
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="flex flex-col items-center p-6 h-full w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between w-full items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <FileQuestion className="w-8 h-8 text-indigo-500" />
                    Trivial Mental
                </h3>
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                        <span className="text-indigo-700 font-bold text-lg">Pregunta {currentIndex + 1} / {QUESTIONS_PER_GAME}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center w-full gap-8 max-w-3xl">
                <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 leading-tight">{currentQ.question}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQ.options.map((option, index) => {
                        let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300";

                        if (selectedOption) {
                            if (option === currentQ.correctAnswer) {
                                btnClass = "bg-emerald-500 border-emerald-600 text-white shadow-md scale-[1.02] z-10";
                            } else if (option === selectedOption) {
                                btnClass = "bg-rose-500 border-rose-600 text-white opacity-90";
                            } else {
                                btnClass = "bg-white border-2 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed";
                            }
                        }

                        return (
                            <button
                                key={index}
                                disabled={selectedOption !== null}
                                onClick={() => handleAnswer(option)}
                                className={`p-6 text-xl sm:text-2xl font-bold rounded-2xl shadow-sm transition-all text-left flex items-center gap-4 active:scale-95 disabled:active:scale-100 ${btnClass}`}
                            >
                                <span className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function MiniChatAssistant({ gameName }: { gameName: string }) {
    const { aiName } = useEduMate();
    const [messages, setMessages] = useState<{ id: string, role: 'user' | 'assistant', content: string }[]>([
        { id: 'sys-1', role: 'assistant', content: `¡Hola! Soy ${aiName}. Estoy aquí abajo si necesitas una pista o no entiendes cómo jugar a ${gameName}.` }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Option to add a system message or change greeting when game changes
        setMessages([{ id: Date.now().toString(), role: 'assistant', content: `¡Hola! Soy ${aiName}. Estoy aquí abajo si necesitas una pista o no entiendes cómo jugar a ${gameName}.` }]);
    }, [gameName, aiName]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isGenerating) return;

        const newMsg = { id: Date.now().toString(), role: 'user' as const, content: inputValue };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsGenerating(true);

        try {
            const prompt = `INSTRUCCIÓN DE SISTEMA: Eres ${aiName}, un asistente amigable y paciente para personas mayores. Actualmente, el usuario está jugando al juego: ${gameName}. Si el usuario te pide ayuda, pistas o consejos, dáselos ESPECÍFICAMENTE sobre el juego ${gameName}. Sé breve, claro y motivador. No resuelvas el juego por él, solo dale estrategias.`;

            const apiMessages = [
                { role: 'system', content: prompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: newMsg.content }
            ] as const;

            // @ts-ignore
            const responseText = await aiService.generate(apiMessages);

            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: responseText }]);
        } catch (error) {
            console.error('MiniChat error:', error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Lo siento, tuve un problema pensando la respuesta. ¿Me lo repites?' }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-t-3xl border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="bg-indigo-50 border-b border-indigo-100 p-3 flex items-center gap-3 shrink-0">
                <div className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm">
                    <HelpCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 flex-1">Asistente de Juegos</h4>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <UserCircle className="w-5 h-5" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-base font-medium shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isGenerating && (
                    <div className="flex gap-3 max-w-[90%]">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                            <UserCircle className="w-5 h-5" />
                        </div>
                        <div className="p-3 bg-slate-100 rounded-2xl rounded-tl-none flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-75"></span>
                            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Pregúntame algo..."
                        className="flex-1 bg-white border border-slate-300 rounded-full px-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isGenerating}
                        className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full flex items-center justify-center disabled:cursor-not-allowed shadow-sm transition-colors shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function GamesModule() {
    const [selectedGame, setSelectedGame] = useState(GAMES[0].id);

    return (
        <div className="flex h-[100dvh] bg-slate-50 rounded-3xl overflow-hidden shadow-sm border border-slate-200 flex-col md:flex-row">

            {/* Sidebar / Topnav menu */}
            <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 p-4 gap-2 no-scrollbar">
                <div className="hidden md:flex items-center gap-3 pb-4 mb-2 border-b border-slate-100 px-2 shrink-0">
                    <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Gimnasio Mental</h2>
                </div>

                {GAMES.map(game => {
                    const iconMap: Record<string, React.ReactNode> = {
                        'ahorcado': <Gamepad2 className={`w-5 h-5 ${selectedGame === game.id ? 'text-indigo-200' : 'text-slate-400'}`} />,
                        'trivial': <FileQuestion className={`w-5 h-5 ${selectedGame === game.id ? 'text-indigo-200' : 'text-slate-400'}`} />,
                        'pasapalabra': <Gamepad2 className={`w-5 h-5 ${selectedGame === game.id ? 'text-indigo-200' : 'text-slate-400'}`} />,
                        'crucigrama': <Gamepad2 className={`w-5 h-5 ${selectedGame === game.id ? 'text-indigo-200' : 'text-slate-400'}`} />,
                        'laberinto': <Gamepad2 className={`w-5 h-5 ${selectedGame === game.id ? 'text-indigo-200' : 'text-slate-400'}`} />,
                        'apalabrados': <Gamepad2 className={`w-5 h-5 ${selectedGame === game.id ? 'text-indigo-200' : 'text-slate-400'}`} />,
                        'sopa': <Search className={`w-5 h-5 ${selectedGame === game.id ? 'text-indigo-200' : 'text-slate-400'}`} />,
                    };
                    return (
                        <button
                            key={game.id}
                            onClick={() => setSelectedGame(game.id)}
                            className={`flex items-center gap-3 px-4 py-3 md:py-4 rounded-xl font-bold transition-all shadow-sm shrink-0 whitespace-nowrap md:whitespace-normal ${selectedGame === game.id ? 'bg-indigo-600 text-white shadow-md scale-[1.02]' : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'}`}
                        >
                            {iconMap[game.id] || <Gamepad2 className={`w-5 h-5 ${selectedGame === game.id ? 'text-indigo-200' : 'text-slate-400'}`} />}
                            <span className="text-sm md:text-base">{game.name}</span>
                        </button>
                    )
                })}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* 70% Game Area */}
                <div className="flex-[7] overflow-y-auto bg-slate-50 relative">
                    {selectedGame === 'ahorcado' ? (
                        <HangmanGame />
                    ) : selectedGame === 'trivial' ? (
                        <TrivialGame />
                    ) : selectedGame === 'pasapalabra' ? (
                        <PasapalabraGame />
                    ) : selectedGame === 'crucigrama' ? (
                        <CrosswordGame />
                    ) : selectedGame === 'laberinto' ? (
                        <MazeGame />
                    ) : selectedGame === 'apalabrados' ? (
                        <ApalabradosGame />
                    ) : selectedGame === 'sopa' ? (
                        <SopaDeLetrasGame />
                    ) : (
                        <PlaceholderGame name={GAMES.find(g => g.id === selectedGame)?.name || ''} />
                    )}
                </div>

                {/* Mini Chat Area (Hidden in Maze Game) */}
                {selectedGame !== 'laberinto' && (
                    <div className="flex-[3] min-h-[250px] md:min-h-0 relative z-10 shrink-0 border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                        <MiniChatAssistant key={selectedGame} gameName={GAMES.find(g => g.id === selectedGame)?.name || ''} />
                    </div>
                )}
            </div>

        </div>
    );
}
