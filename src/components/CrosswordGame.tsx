import React, { useState, useEffect, useMemo } from 'react';
import { useEduMate } from '../context/EduMateContext';
import { CROSSWORD_BANK, CrosswordLevel, CrosswordWord } from '../data/crucigramaBank';
import { normalizeSpanishWord } from '../utils/textUtils';
import { PlayCircle, Check, X, RotateCcw, Lightbulb, Grid3X3 } from 'lucide-react';

interface UserAnswers {
    [key: string]: string; // "x,y": "A"
}

export default function CrosswordGame() {
    const { updateUserStats } = useEduMate();

    const [currentLevel, setCurrentLevel] = useState<CrosswordLevel>(CROSSWORD_BANK[0]);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
    const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());

    // Interaction Zone
    const [inputValue, setInputValue] = useState('');
    const [solutionMessage, setSolutionMessage] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const activeWord = useMemo(() => {
        if (!selectedWordId) return null;
        return currentLevel.words.find(w => w.id === selectedWordId) || null;
    }, [selectedWordId, currentLevel]);

    const startGame = () => {
        setGameState('playing');
        setUserAnswers({});
        setCompletedWords(new Set());
        setSelectedWordId(currentLevel.words[0].id);
        setInputValue('');
        setSolutionMessage(null);
    };

    const handleExit = () => {
        setGameState('idle');
    };

    const handleLevelChange = (levelId: number) => {
        const availableLevels = CROSSWORD_BANK.filter(l => l.id === levelId);
        const newLevel = availableLevels.length > 0
            ? availableLevels[Math.floor(Math.random() * availableLevels.length)]
            : CROSSWORD_BANK[0];

        setCurrentLevel(newLevel);
        setGameState('idle');
        setUserAnswers({});
        setCompletedWords(new Set());
        setSelectedWordId(null);
        setInputValue('');
        setSolutionMessage(null);
    };

    const getCellClass = (x: number, y: number) => {
        // Find which words occupy this cell
        const occupyingWords = currentLevel.words.filter(w => {
            if (w.direction === 'horizontal') {
                return y === w.startY && x >= w.startX && x < w.startX + w.word.length;
            } else {
                return x === w.startX && y >= w.startY && y < w.startY + w.word.length;
            }
        });

        if (occupyingWords.length === 0) {
            return 'bg-transparent border-transparent'; // Empty space
        }

        const isSelected = occupyingWords.some(w => w.id === selectedWordId);
        const isCompleted = occupyingWords.every(w => completedWords.has(w.id)); // If all words on this cell are complete

        let baseClass = 'border-2 cursor-pointer transition-colors flex items-center justify-center text-sm md:text-xl font-bold uppercase shadow-sm ';

        if (isSelected) {
            baseClass += 'bg-blue-100 border-blue-400 text-blue-900';
        } else if (isCompleted) {
            baseClass += 'bg-emerald-100 border-emerald-300 text-emerald-800';
        } else {
            baseClass += 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50';
        }

        return baseClass;
    };

    const handleCellClick = (x: number, y: number) => {
        if (gameState !== 'playing') return;

        const occupyingWords = currentLevel.words.filter(w => {
            if (w.direction === 'horizontal') {
                return y === w.startY && x >= w.startX && x < w.startX + w.word.length;
            } else {
                return x === w.startX && y >= w.startY && y < w.startY + w.word.length;
            }
        });

        if (occupyingWords.length === 0) return;

        if (occupyingWords.length === 1) {
            setSelectedWordId(occupyingWords[0].id);
        } else {
            // Toggle if the current selected is one of them
            if (occupyingWords[0].id === selectedWordId) {
                setSelectedWordId(occupyingWords[1].id);
            } else {
                setSelectedWordId(occupyingWords[0].id);
            }
        }
        setInputValue('');
        setSolutionMessage(null);
    };

    const checkVictory = (newCompleted: Set<string>) => {
        if (newCompleted.size === currentLevel.words.length) {
            setGameState('ended');
            updateUserStats(true); // Game won
        }
    };

    const handleCheckWord = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeWord || !inputValue.trim() || isChecking) return;

        setIsChecking(true);
        const normalizedInput = normalizeSpanishWord(inputValue.trim());
        const normalizedTarget = normalizeSpanishWord(activeWord.word);

        if (normalizedInput === normalizedTarget) {
            // Correct
            const newAnswers = { ...userAnswers };
            for (let i = 0; i < activeWord.word.length; i++) {
                const char = activeWord.word[i].toUpperCase();
                if (activeWord.direction === 'horizontal') {
                    newAnswers[`${activeWord.startX + i},${activeWord.startY}`] = char;
                } else {
                    newAnswers[`${activeWord.startX},${activeWord.startY + i}`] = char;
                }
            }
            setUserAnswers(newAnswers);

            const newCompleted = new Set(completedWords);
            newCompleted.add(activeWord.id);
            setCompletedWords(newCompleted);

            setInputValue('');
            setSolutionMessage(null);

            // Auto-select next uncompleted word
            const nextWord = currentLevel.words.find(w => !newCompleted.has(w.id));
            if (nextWord) {
                setTimeout(() => setSelectedWordId(nextWord.id), 500);
            }

            checkVictory(newCompleted);
        } else {
            // Incorrect
            setSolutionMessage("Sigue intentándolo, esa no es la palabra.");
            setTimeout(() => setSolutionMessage(null), 3000);
            setInputValue('');
        }
        setIsChecking(false);
    };

    const handleHint = () => {
        if (!activeWord) return;

        // Find an empty cell in the active word to reveal
        for (let i = 0; i < activeWord.word.length; i++) {
            const char = activeWord.word[i].toUpperCase();
            const coord = activeWord.direction === 'horizontal'
                ? `${activeWord.startX + i},${activeWord.startY}`
                : `${activeWord.startX},${activeWord.startY + i}`;

            if (!userAnswers[coord]) {
                setUserAnswers(prev => ({ ...prev, [coord]: char }));
                setSolutionMessage(`Pista: Letra '${char}' revelada`);
                setTimeout(() => setSolutionMessage(null), 3000);
                break;
            }
        }

        // Check if word is complete via hints (optional logic edge case, wait for user to type or auto-check?)
        // Let's just reveal the visual letter. User still has to type it to "complete" the word.
    };

    if (gameState === 'idle') {
        // Obtenemos un solo botón por cada ID de nivel para la pantalla de inicio
        const uniqueLevels = CROSSWORD_BANK.reduce((acc, current) => {
            if (!acc.find(item => item.id === current.id)) {
                acc.push(current);
            }
            return acc;
        }, [] as CrosswordLevel[]);

        return (
            <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-in zoom-in-95 duration-500">
                <div className="bg-white p-10 rounded-3xl border-2 border-indigo-100 text-center w-full max-w-lg shadow-sm">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Grid3X3 className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 mb-4">Crucigrama</h2>
                    <p className="text-xl text-slate-500 mb-6 font-medium">Resuelve el tablero descubriendo las palabras ocultas. Elige tu dificultad y comienza a jugar.</p>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {uniqueLevels.map(lvl => (
                            <button
                                key={lvl.id}
                                onClick={() => handleLevelChange(lvl.id)}
                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${currentLevel.id === lvl.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'}`}
                            >
                                Nivel {lvl.id}
                            </button>
                        ))}
                    </div>

                    <button onClick={startGame} className="px-8 py-5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-white text-2xl shadow-md w-full transition-transform active:scale-95">
                        ¡Jugar Ahora!
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'ended') {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-in zoom-in-95 duration-500">
                <div className="bg-emerald-50 p-10 rounded-3xl border-2 border-emerald-200 text-center w-full max-w-lg shadow-sm text-emerald-800">
                    <h4 className="text-4xl font-black mb-4">¡Crucigrama Completado! 🎉</h4>
                    <p className="text-xl mb-8 font-medium">¡Excelente trabajo! Has resuelto todas las palabras.</p>
                    <button onClick={startGame} className="px-8 py-5 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold text-white text-2xl shadow-md w-full transition-transform active:scale-95 flex items-center justify-center gap-3">
                        <RotateCcw className="w-6 h-6" /> Volver a Jugar
                    </button>
                </div>
            </div>
        );
    }

    // Grid rendering logic
    const gridCells = [];
    for (let y = 0; y < currentLevel.gridSize.rows; y++) {
        for (let x = 0; x < currentLevel.gridSize.cols; x++) {
            const coord = `${x},${y}`;
            const cellClass = getCellClass(x, y);
            const isClickable = !cellClass.includes('bg-transparent');

            // Find if this cell is the START of any word to show a tiny number
            const startingWords = currentLevel.words.filter(w => w.startX === x && w.startY === y);

            gridCells.push(
                <div
                    key={coord}
                    className={`w-full h-full relative rounded-[10%] sm:rounded-lg ${cellClass}`}
                    onClick={() => isClickable && handleCellClick(x, y)}
                >
                    {isClickable && startingWords.length > 0 && (
                        <span className="absolute top-[2px] left-[4px] text-[8px] sm:text-[10px] leading-none font-bold text-slate-500">
                            {startingWords[0].id.replace(/[HV]/, '')}
                        </span>
                    )}
                    {userAnswers[coord] || ''}
                </div>
            );
        }
    }

    return (
        <div className="flex flex-col h-full flex-1 min-h-0 relative animate-in fade-in duration-500">

            {/* Header (Modo Foco) */}
            {currentLevel === null ? (
                <div className="flex justify-between items-center bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0 z-10 relative">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            <Grid3X3 className="w-6 h-6 text-indigo-500" />
                            Crucigrama
                        </h3>
                    </div>
                </div>
            ) : (
                <div className="absolute top-2 right-2 z-20">
                    <button
                        onClick={handleExit}
                        className="flex items-center gap-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-full border border-rose-200 transition-all font-bold text-sm shadow-sm"
                    >
                        <X className="w-4 h-4" /> Salir
                    </button>
                </div>
            )}

            {/* Board Area */}
            <div className="flex-1 min-h-0 w-full flex items-center justify-center p-2">
                <div
                    className="grid w-full aspect-square m-auto gap-0.5 sm:gap-1 max-w-[min(100%,_45vh)]"
                    style={{ gridTemplateColumns: `repeat(${currentLevel.gridSize.cols}, minmax(0, 1fr))` }}
                >
                    {gridCells}
                </div>
            </div>

            {/* Interaction Zone */}
            <div className="flex-shrink-0 z-10 bg-white pt-2 pb-4 rounded-3xl px-4 sm:px-5 shadow-lg border border-slate-200 flex flex-col gap-3 mt-4">
                {activeWord ? (
                    <>
                        <div className="text-center w-full max-w-2xl mx-auto mb-2">
                            <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                                {activeWord.direction === 'horizontal' ? 'Horizontal' : 'Vertical'} • Palabra {activeWord.word.length} letras
                            </span>
                            <h4 className="text-xl sm:text-2xl font-bold text-slate-700">{activeWord.clue}</h4>
                        </div>

                        <form onSubmit={handleCheckWord} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto">
                            {completedWords.has(activeWord.id) ? (
                                <div className="flex-1 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 font-bold text-xl rounded-xl flex items-center justify-center h-14 uppercase tracking-widest">
                                    {activeWord.word} <Check className="w-6 h-6 ml-2" />
                                </div>
                            ) : (
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Escribe la palabra aquí..."
                                        maxLength={activeWord.word.length}
                                        className={`w-full h-14 text-center text-xl font-bold uppercase text-slate-800 bg-slate-50 border-2 rounded-xl focus:ring-4 outline-none transition-all placeholder:text-slate-400 placeholder:normal-case shadow-inner ${solutionMessage ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-100 bg-amber-50 text-amber-900' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'}`}
                                        autoFocus
                                        autoComplete="off"
                                    />
                                    {solutionMessage && (
                                        <div className="absolute -top-10 left-0 right-0 text-center animate-in slide-in-from-bottom-2">
                                            <span className="bg-amber-100 text-amber-800 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
                                                {solutionMessage}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!completedWords.has(activeWord.id) && (
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleHint}
                                        className="h-14 px-4 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl transition-all shadow-sm flex items-center justify-center active:scale-95"
                                        title="Mostrar una letra"
                                    >
                                        <Lightbulb className="w-6 h-6" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim() || isChecking}
                                        className="h-14 px-6 sm:px-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-black text-lg rounded-xl transition-all shadow-sm flex items-center justify-center active:scale-95"
                                    >
                                        COMPROBAR
                                    </button>
                                </div>
                            )}
                        </form>
                    </>
                ) : (
                    <div className="py-6 text-center text-slate-500 font-medium text-lg">
                        Selecciona una casilla en el tablero para comenzar.
                    </div>
                )}
            </div>

        </div>
    );
}
