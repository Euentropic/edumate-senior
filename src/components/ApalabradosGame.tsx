'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCcw, Play, Trophy } from 'lucide-react';
import { WORDS } from '../data/wordBank';
import { normalizeSpanishWord } from '../utils/textUtils';

interface BoardCellData {
    letter: string | null;
    isLocked: boolean;
    row: number;
    col: number;
}

const LETTER_VALUES: Record<string, number> = {
    A: 1, E: 1, O: 1, S: 1, I: 1, U: 1, N: 1, L: 1, R: 1, T: 1,
    D: 2, G: 2, C: 3, B: 3, M: 3, P: 3, H: 4, F: 4, V: 4, Y: 4,
    Q: 5, J: 8, 'Ñ': 8, X: 8, Z: 10
};

const TARGET_SCORE = 50;
const SWAP_PENALTY = 3;

const SCRABBLE_BAG = [
    ...'A'.repeat(12), ...'E'.repeat(12), ...'I'.repeat(6), ...'O'.repeat(9), ...'U'.repeat(5),
    ...'B'.repeat(2), ...'C'.repeat(4), ...'D'.repeat(5), ...'F'.repeat(1), ...'G'.repeat(2),
    ...'H'.repeat(2), ...'J'.repeat(1), ...'L'.repeat(4), ...'M'.repeat(2), ...'N'.repeat(5),
    ...'Ñ'.repeat(1), ...'P'.repeat(2), ...'Q'.repeat(1), ...'R'.repeat(5), ...'S'.repeat(6),
    ...'T'.repeat(4), ...'V'.repeat(1), ...'X'.repeat(1), ...'Y'.repeat(1), ...'Z'.repeat(1)
];

// Función de apoyo para obtener letras
const generateLetters = (count: number): string[] => {
    let result: string[] = [];
    for (let i = 0; i < count; i++) {
        result.push(SCRABBLE_BAG[Math.floor(Math.random() * SCRABBLE_BAG.length)]);
    }
    return result;
};

export default function ApalabradosGame() {
    const [board, setBoard] = useState<BoardCellData[][]>([]);
    const [rack, setRack] = useState<(string | null)[]>(Array(7).fill(null));
    const [selectedRackIndex, setSelectedRackIndex] = useState<number | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const [hasWon, setHasWon] = useState<boolean>(false);
    const [topRecords, setTopRecords] = useState<number[]>([]);

    useEffect(() => {
        const savedRecords = localStorage.getItem('edumate_apalabrados_records');
        if (savedRecords) {
            setTopRecords(JSON.parse(savedRecords));
        }
        initGame();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && !hasWon) {
            interval = setInterval(() => {
                setTimeElapsed((prevTime) => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, hasWon]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const initGame = () => {
        const newBoard: BoardCellData[][] = Array(15).fill(null).map((_, row) =>
            Array(15).fill(null).map((_, col) => ({
                letter: null,
                isLocked: false,
                row,
                col,
            }))
        );

        const centerRow = 7;
        const centerCol = 7;
        const word = "HOLA";
        const startCol = centerCol - Math.floor(word.length / 2);
        for (let i = 0; i < word.length; i++) {
            newBoard[centerRow][startCol + i].letter = word[i];
            newBoard[centerRow][startCol + i].isLocked = true;
        }

        setBoard(newBoard);

        const newRack = generateLetters(7);
        setRack(newRack);
        setSelectedRackIndex(null);
        setScore(0);
        setTimeElapsed(0);
        setIsTimerActive(false);
        setHasWon(false);
        setMessage(null);
    };

    const handleRackClick = (index: number) => {
        if (rack[index] === null) return;
        if (selectedRackIndex === index) {
            setSelectedRackIndex(null);
        } else {
            setSelectedRackIndex(index);
        }
    };

    const handleBoardClick = (row: number, col: number) => {
        const cell = board[row][col];

        if (!cell.letter && selectedRackIndex !== null) {
            if (!isTimerActive && !hasWon) setIsTimerActive(true);

            const letterToPlace = rack[selectedRackIndex];

            const newBoard = [...board];
            newBoard[row] = [...newBoard[row]];
            newBoard[row][col] = { ...cell, letter: letterToPlace, isLocked: false };
            setBoard(newBoard);

            const newRack = [...rack];
            newRack[selectedRackIndex] = null;
            setRack(newRack);

            setSelectedRackIndex(null);
            return;
        }

        if (cell.letter && !cell.isLocked) {
            const emptyRackIndex = rack.findIndex(l => l === null);
            if (emptyRackIndex !== -1) {
                const newRack = [...rack];
                newRack[emptyRackIndex] = cell.letter;
                setRack(newRack);

                const newBoard = [...board];
                newBoard[row] = [...newBoard[row]];
                newBoard[row][col] = { ...cell, letter: null };
                setBoard(newBoard);
            }
        }
    };

    const handlePlayWord = async () => {
        setMessage(null);
        const newTiles: { r: number, c: number, letter: string }[] = [];

        // A. Identificar fichas nuevas
        for (let r = 0; r < 15; r++) {
            for (let c = 0; c < 15; c++) {
                if (board[r][c].letter && !board[r][c].isLocked) {
                    newTiles.push({ r, c, letter: board[r][c].letter! });
                }
            }
        }

        if (newTiles.length === 0) return;

        // B. Alineación
        const isHorizontal = newTiles.every(t => t.r === newTiles[0].r);
        const isVertical = newTiles.every(t => t.c === newTiles[0].c);

        if (!isHorizontal && !isVertical) {
            handleReturnInvalidWord("Las letras deben estar en línea recta.");
            return;
        }

        // Determinar orientación final si solo hay 1 ficha jugada (inferir por vecinas)
        let orientation: 'H' | 'V' = isHorizontal ? 'H' : 'V';
        if (newTiles.length === 1) {
            const { r, c } = newTiles[0];
            const hasHorizontalNeighbors = (c > 0 && board[r][c - 1].letter) || (c < 14 && board[r][c + 1].letter);
            const hasVerticalNeighbors = (r > 0 && board[r - 1][c].letter) || (r < 14 && board[r + 1][c].letter);

            if (hasHorizontalNeighbors) orientation = 'H';
            else if (hasVerticalNeighbors) orientation = 'V';
            else {
                handleReturnInvalidWord("La palabra debe conectar con letras del tablero.");
                return;
            }
        }

        // C. Extracción de la Palabra
        let wordStr = '';
        let startR = newTiles[0].r;
        let startC = newTiles[0].c;
        let endR = newTiles[newTiles.length - 1].r;
        let endC = newTiles[newTiles.length - 1].c;

        let usesLockedLetter = false;

        if (orientation === 'H') {
            const r = newTiles[0].r;
            // Buscar inicio real
            let currentC = Math.min(...newTiles.map(t => t.c));
            while (currentC > 0 && board[r][currentC - 1].letter) {
                currentC--;
            }
            startC = currentC;

            // Buscar fin real
            let maxC = Math.max(...newTiles.map(t => t.c));
            while (maxC < 14 && board[r][maxC + 1].letter) {
                maxC++;
            }
            endC = maxC;

            // Construir string y chequear conexión
            for (let c = startC; c <= endC; c++) {
                const cell = board[r][c];
                if (!cell.letter) {
                    handleReturnInvalidWord("Hay huecos en la palabra.");
                    return;
                }
                wordStr += cell.letter;
                if (cell.isLocked) usesLockedLetter = true;
            }
        } else {
            const c = newTiles[0].c;
            // Buscar inicio real
            let currentR = Math.min(...newTiles.map(t => t.r));
            while (currentR > 0 && board[currentR - 1][c].letter) {
                currentR--;
            }
            startR = currentR;

            // Buscar fin real
            let maxR = Math.max(...newTiles.map(t => t.r));
            while (maxR < 14 && board[maxR + 1][c].letter) {
                maxR++;
            }
            endR = maxR;

            // Construir string y chequear conexión
            for (let r = startR; r <= endR; r++) {
                const cell = board[r][c];
                if (!cell.letter) {
                    handleReturnInvalidWord("Hay huecos en la palabra.");
                    return;
                }
                wordStr += cell.letter;
                if (cell.isLocked) usesLockedLetter = true;
            }
        }

        // D. Conexión
        if (!usesLockedLetter) {
            handleReturnInvalidWord("La palabra debe usar letras del tablero.");
            return;
        }

        // E. Validación Diccionario (Wiktionary API)
        const normalizedAsKey = normalizeSpanishWord(wordStr).toUpperCase();

        // Conservar explícitamente la 'ñ' al normalizar para MediaWiki
        const palabraNormalizada = wordStr.toLowerCase()
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u');

        setIsChecking(true);
        let isValid = false;

        try {
            const url = `https://es.wiktionary.org/w/api.php?action=query&list=search&srsearch=${palabraNormalizada}&utf8=&format=json&origin=*`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                if (data.query?.search?.length > 0) {
                    const primerResultado = data.query.search[0].title.toLowerCase();
                    const tituloLimpio = primerResultado
                        .replace(/[áàäâ]/g, 'a')
                        .replace(/[éèëê]/g, 'e')
                        .replace(/[íìïî]/g, 'i')
                        .replace(/[óòöô]/g, 'o')
                        .replace(/[úùüû]/g, 'u');

                    if (tituloLimpio === palabraNormalizada) {
                        isValid = true;
                    }
                }
            } else {
                // Fallback local if API fails for other reasons (e.g. 500)
                isValid = WORDS.includes(normalizedAsKey);
            }
        } catch (error) {
            // Fallback local if network error
            isValid = WORDS.includes(normalizedAsKey);
        }

        setIsChecking(false);

        if (!isValid) {
            handleReturnInvalidWord(`La palabra "${wordStr}" no existe.`);
            return;
        }

        // F. Calcular Puntuación
        const wordScore = normalizedAsKey.split('').reduce((acc, char) => acc + (LETTER_VALUES[char] || 1), 0);
        setScore(prev => prev + wordScore);

        // Éxito: Bloquear fichas y reponer atril
        const newBoard = board.map(row =>
            row.map(cell => cell.letter && !cell.isLocked ? { ...cell, isLocked: true } : cell)
        );
        setBoard(newBoard);

        // Reponer atril
        let currentRack = [...rack];
        for (let i = 0; i < 7; i++) {
            if (currentRack[i] === null) {
                currentRack[i] = SCRABBLE_BAG[Math.floor(Math.random() * SCRABBLE_BAG.length)];
            }
        }

        setRack(currentRack);

        // Verificar Victoria
        const newTotalScore = score + wordScore;
        if (newTotalScore >= TARGET_SCORE) {
            setHasWon(true);
            setIsTimerActive(false);

            // Guardar Récord
            const newRecords = [...topRecords, timeElapsed].sort((a, b) => a - b).slice(0, 5);
            setTopRecords(newRecords);
            localStorage.setItem('edumate_apalabrados_records', JSON.stringify(newRecords));

            setMessage(null);
        } else {
            setMessage({ text: `¡Palabra Correcta! +${wordScore} pts`, type: 'success' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleReturnInvalidWord = (errorMsg: string) => {
        setMessage({ text: errorMsg, type: 'error' });
        setTimeout(() => setMessage(null), 3000);

        let currentRack = [...rack];
        let currentBoard = [...board];

        for (let r = 0; r < 15; r++) {
            for (let c = 0; c < 15; c++) {
                if (currentBoard[r][c].letter && !currentBoard[r][c].isLocked) {
                    const emptyIdx = currentRack.findIndex(l => l === null);
                    if (emptyIdx !== -1) {
                        currentRack[emptyIdx] = currentBoard[r][c].letter;
                        currentBoard[r][c] = { ...currentBoard[r][c], letter: null };
                    }
                }
            }
        }
        setBoard(currentBoard);
        setRack(currentRack);
        setSelectedRackIndex(null);
    };

    const handlePass = () => {

        let currentRack = [...rack];
        let currentBoard = [...board];

        for (let r = 0; r < 15; r++) {
            for (let c = 0; c < 15; c++) {
                if (currentBoard[r][c].letter && !currentBoard[r][c].isLocked) {
                    const emptyIdx = currentRack.findIndex(l => l === null);
                    if (emptyIdx !== -1) {
                        currentRack[emptyIdx] = currentBoard[r][c].letter;
                        currentBoard[r][c] = { ...currentBoard[r][c], letter: null };
                    }
                }
            }
        }
        setBoard(currentBoard);

        // Penalización por cambiar
        if (score > 0) {
            setScore(prev => Math.max(0, prev - SWAP_PENALTY));
            setMessage({ text: `¡-${SWAP_PENALTY} pts por cambiar!`, type: 'error' });
            setTimeout(() => setMessage(null), 3000);
        }

        const newRack = generateLetters(7);
        setRack(newRack);
        setSelectedRackIndex(null);
    };

    if (board.length === 0) return null;

    return (
        <div className="flex flex-col h-full flex-1 min-h-0 relative bg-slate-100">
            {/* Header de Puntuación */}
            <div className="flex-shrink-0 w-full flex justify-between items-center p-2 px-4 bg-white border-b shadow-sm z-10">
                <div className="flex items-center gap-2 text-indigo-700 font-bold bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>Puntuación: {score} / {TARGET_SCORE}</span>
                </div>
                <div className="text-slate-600 font-mono font-bold text-lg bg-slate-100 px-3 py-1 rounded-md">
                    ⏱️ {formatTime(timeElapsed)}
                </div>
            </div>

            <div className="flex-1 min-h-0 w-full flex items-center justify-center p-2">
                <div
                    className="grid aspect-square h-full max-h-[50vh] sm:max-h-[60vh] mx-auto bg-slate-100 border-2 border-slate-400 shadow-md"
                    style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))', gridTemplateRows: 'repeat(15, minmax(0, 1fr))' }}
                >
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => {
                            let cellBg = "";
                            if (rowIndex === 7 && colIndex === 7) cellBg = "bg-rose-200";

                            const hasLetter = cell.letter !== null;
                            const isLocked = cell.isLocked;

                            let tileStyle = "w-[85%] h-[85%] bg-amber-100 rounded flex items-center justify-center text-xs sm:text-sm md:text-base font-bold text-slate-800 shadow cursor-pointer";
                            if (hasLetter && !isLocked) {
                                tileStyle += " ring-2 ring-amber-400 animate-in zoom-in-95 duration-200";
                            }

                            return (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => handleBoardClick(rowIndex, colIndex)}
                                    disabled={!hasLetter && selectedRackIndex === null}
                                    className={`border border-slate-300 flex items-center justify-center overflow-hidden w-full h-full transition-colors ${cellBg}`}
                                >
                                    {hasLetter && (
                                        <div className={tileStyle}>
                                            {cell.letter}
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Pantalla de Victoria Superpuesta */}
                {hasWon && (
                    <div className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                        <div className="bg-yellow-100 p-4 rounded-full mb-4 shadow-lg border-4 border-yellow-400">
                            <Trophy className="w-16 h-16 text-amber-500" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-2">¡Objetivo Conseguido!</h2>
                        <p className="text-xl text-slate-600 mb-6 font-medium">
                            Has alcanzado los {TARGET_SCORE} puntos en <span className="font-bold text-indigo-600 font-mono">{formatTime(timeElapsed)}</span>
                        </p>

                        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 mb-8 w-full max-w-sm">
                            <h3 className="font-bold text-slate-700 mb-3 uppercase tracking-wide text-sm border-b pb-2">Top Mejores Tiempos</h3>
                            <ul className="space-y-2">
                                {topRecords.map((t, index) => (
                                    <li key={index} className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                        <span className="font-bold text-slate-500">#{index + 1}</span>
                                        <span className={`font-mono font-bold ${index === 0 ? 'text-amber-500' : 'text-slate-700'}`}>
                                            {formatTime(t)}
                                        </span>
                                    </li>
                                ))}
                                {topRecords.length === 0 && <li className="text-slate-500 italic text-sm">Sin récords aún</li>}
                            </ul>
                        </div>

                        <button
                            onClick={initGame}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                        >
                            <RefreshCcw className="w-6 h-6" />
                            Jugar de Nuevo
                        </button>
                    </div>
                )}
            </div>

            {/* Area de Alertas/Mensajes Flotante */}
            {message && (
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in fade-in zoom-in slide-in-from-bottom-5 duration-300">
                    <div className={`px-6 py-3 rounded-full text-white font-bold text-sm sm:text-base md:text-lg shadow-xl shadow-black/20 backdrop-blur-sm border ${message.type === 'error' ? 'bg-rose-500/90 border-rose-400' : 'bg-emerald-500/90 border-emerald-400'}`}>
                        {message.text}
                    </div>
                </div>
            )}

            <div className="flex-shrink-0 z-10 bg-white p-2 sm:p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] rounded-t-xl border-t border-slate-200 flex flex-row items-center justify-center gap-2 sm:gap-4 w-full">
                {/* Botón Cambiar Letras */}
                <button
                    onClick={handlePass}
                    className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-white border-2 border-slate-200 text-slate-600 font-bold w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-colors active:scale-95 shrink-0"
                >
                    <RefreshCcw className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                    <span className="text-[10px] sm:text-xs leading-none">Cambiar</span>
                </button>

                {/* Atril */}
                <div className="flex justify-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-slate-100 rounded-xl sm:rounded-2xl shadow-inner shrink-0 leading-none">
                    {rack.map((letter, index) => {
                        const isSelected = selectedRackIndex === index;
                        return (
                            <button
                                key={index}
                                onClick={() => handleRackClick(index)}
                                className={`w-10 h-10 sm:w-12 sm:h-12 font-black uppercase text-lg sm:text-2xl rounded-lg sm:rounded-xl transition-all shadow-sm flex items-center justify-center ${letter ? 'bg-stone-50 border-b-4 border-stone-300 text-stone-800 hover:bg-stone-100' : 'bg-slate-200 border-none opacity-50 cursor-default'} ${isSelected ? 'ring-4 ring-indigo-500 scale-110 -translate-y-2' : ''}`}
                            >
                                {letter}
                            </button>
                        );
                    })}
                </div>

                {/* Botón Jugar Palabra */}
                <button
                    onClick={handlePlayWord}
                    disabled={isChecking}
                    className={`flex flex-col items-center justify-center gap-1 sm:gap-2 text-white font-bold w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl shadow-md transition-colors shrink-0 ${isChecking ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
                >
                    {isChecking ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"></div>
                    ) : (
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current shrink-0" />
                    )}
                    <span className="text-[10px] sm:text-xs leading-none">
                        {isChecking ? '...' : 'Jugar'}
                    </span>
                </button>
            </div>
        </div>
    );
}
