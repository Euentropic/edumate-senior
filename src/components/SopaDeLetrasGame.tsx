'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCcw, Trophy } from 'lucide-react';
import { getRandomUnplayedItems, markItemsAsPlayed } from '../services/historyService';
import { SOPA_WORDS } from '../data/wordBank';

const GRID_SIZE = 12;

interface CellData {
    letter: string;
    r: number;
    c: number;
}

export default function SopaDeLetrasGame() {
    const [grid, setGrid] = useState<CellData[][]>([]);
    const [selectedStart, setSelectedStart] = useState<{ r: number, c: number } | null>(null);
    const [wordsToFind, setWordsToFind] = useState<string[]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [foundCells, setFoundCells] = useState<{ [key: string]: boolean }>({});
    const [hasWon, setHasWon] = useState(false);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        // Initialize empty grid
        let newGrid: CellData[][] = Array(GRID_SIZE).fill(null).map((_, r) =>
            Array(GRID_SIZE).fill(null).map((_, c) => ({ letter: '', r, c }))
        );

        const orthDirections = [
            { dr: 0, dc: 1 },   // Horizontal right
            { dr: 0, dc: -1 },  // Horizontal left
            { dr: 1, dc: 0 },   // Vertical down
            { dr: -1, dc: 0 }   // Vertical up
        ];

        const diagDirections = [
            { dr: 1, dc: 1 },   // Diagonal down-right
            { dr: -1, dc: 1 },  // Diagonal up-right
            { dr: 1, dc: -1 },  // Diagonal down-left
            { dr: -1, dc: -1 }  // Diagonal up-left
        ];

        const allDirections = [...orthDirections, ...diagDirections];

        // Fetch unplayed words
        const gameWords = getRandomUnplayedItems('sopa_letras', SOPA_WORDS, 6);
        setWordsToFind(gameWords);

        // Place words
        for (let wIndex = 0; wIndex < gameWords.length; wIndex++) {
            const word = gameWords[wIndex];
            const isDiagonalForced = wIndex < 2; // Force the first 2 words to be diagonal

            let placed = false;
            let attempts = 0;
            const possibleDirs = isDiagonalForced ? diagDirections : allDirections;

            while (!placed && attempts < 200) {
                const dir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
                let r = Math.floor(Math.random() * GRID_SIZE);
                let c = Math.floor(Math.random() * GRID_SIZE);

                // Check bounds strictly (start and end)
                const endR = r + dir.dr * (word.length - 1);
                const endC = c + dir.dc * (word.length - 1);

                if (endR >= 0 && endR < GRID_SIZE && endC >= 0 && endC < GRID_SIZE) {
                    let canPlace = true;
                    // Check overlap
                    for (let i = 0; i < word.length; i++) {
                        const cell = newGrid[r + dir.dr * i][c + dir.dc * i];
                        if (cell.letter !== '' && cell.letter !== word[i]) {
                            canPlace = false;
                            break;
                        }
                    }

                    if (canPlace) {
                        for (let i = 0; i < word.length; i++) {
                            newGrid[r + dir.dr * i][c + dir.dc * i].letter = word[i];
                        }
                        placed = true;
                    }
                }
                attempts++;
            }
        }

        // Fill empty spaces with random uppercase letters
        const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (newGrid[r][c].letter === '') {
                    newGrid[r][c].letter = alphabet[Math.floor(Math.random() * alphabet.length)];
                }
            }
        }

        setGrid(newGrid);
        setSelectedStart(null);
        setFoundWords([]);
        setFoundCells({});
        setHasWon(false);
    };

    const handleCellClick = (r: number, c: number) => {
        if (hasWon) return;

        if (selectedStart === null) {
            setSelectedStart({ r, c });
            return;
        }

        // Si el usuario toca la MISMA celda de selectedStart: Cancela la selección
        if (selectedStart.r === r && selectedStart.c === c) {
            setSelectedStart(null);
            return;
        }

        // Si toca una celda DIFERENTE:
        const dc = c - selectedStart.c;
        const dr = r - selectedStart.r;

        // Validación de Línea (Horizontal dr === 0, vertical dc === 0, diagonal Math.abs(dr) === Math.abs(dc))
        if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
            setSelectedStart(null);
            return;
        }

        // Extracción
        const steps = Math.max(Math.abs(dr), Math.abs(dc));
        const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
        const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

        let currentWord = "";
        let cellsInLine: string[] = [];

        for (let i = 0; i <= steps; i++) {
            const row = selectedStart.r + i * stepR;
            const col = selectedStart.c + i * stepC;
            currentWord += grid[row][col].letter;
            cellsInLine.push(`${row}-${col}`);
        }

        // Palabra inversa
        const reverseWord = currentWord.split('').reverse().join('');

        let foundMatch = null;
        if (wordsToFind.includes(currentWord) && !foundWords.includes(currentWord)) {
            foundMatch = currentWord;
        } else if (wordsToFind.includes(reverseWord) && !foundWords.includes(reverseWord)) {
            foundMatch = reverseWord;
        }

        if (foundMatch) {
            const newFoundWords = [...foundWords, foundMatch];
            setFoundWords(newFoundWords);

            const newFoundCells = { ...foundCells };
            cellsInLine.forEach(coord => {
                newFoundCells[coord] = true;
            });
            setFoundCells(newFoundCells);

            if (newFoundWords.length === wordsToFind.length) {
                setHasWon(true);
                markItemsAsPlayed('sopa_letras', newFoundWords);
            }
            setSelectedStart(null);
        } else {
            setSelectedStart(null);
        }
    };

    if (grid.length === 0) return null;

    return (
        <div className="flex flex-col lg:flex-row h-full flex-1 min-h-0 relative bg-slate-100 gap-4 p-4 lg:p-6">

            {/* Contenedor del Tablero */}
            <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center p-2 order-2 lg:order-1 relative">
                <div
                    className="grid aspect-square mx-auto w-full max-w-[min(100%,_65vh)] bg-white border-2 border-slate-300 shadow-sm rounded-xl overflow-hidden"
                    style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gridTemplateRows: 'repeat(12, minmax(0, 1fr))' }}
                >
                    {grid.map((row, rIndex) =>
                        row.map((cell, cIndex) => {
                            const isFound = foundCells[`${rIndex}-${cIndex}`];
                            const isSelected = selectedStart?.r === rIndex && selectedStart?.c === cIndex;

                            let cellClass = "border border-slate-100 flex items-center justify-center text-lg sm:text-xl font-bold font-mono text-slate-700 cursor-pointer select-none transition-colors duration-200";
                            if (isFound) {
                                cellClass += " bg-emerald-100 text-emerald-800 font-black ring-1 ring-inset ring-emerald-300";
                            } else if (isSelected) {
                                cellClass += " bg-blue-300 text-blue-900 border-blue-400 font-black ring-2 ring-inset ring-blue-500";
                            } else {
                                cellClass += " bg-white hover:bg-slate-50";
                            }

                            return (
                                <div
                                    key={`${rIndex}-${cIndex}`}
                                    onClick={() => handleCellClick(rIndex, cIndex)}
                                    className={cellClass}
                                >
                                    {cell.letter}
                                </div>
                            );
                        })
                    )}
                </div>

                {hasWon && (
                    <div className="absolute inset-x-0 bottom-4 sm:top-1/2 sm:-translate-y-1/2 z-50 bg-white/95 max-w-sm mx-auto flex flex-col items-center justify-center p-6 sm:p-8 text-center animate-in fade-in zoom-in slide-in-from-bottom-5 duration-500 rounded-2xl shadow-2xl border border-emerald-100">
                        <div className="bg-emerald-100 p-4 rounded-full mb-4 shadow-sm border-4 border-emerald-400">
                            <Trophy className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-2">¡Nivel Completado!</h2>
                        <p className="text-slate-600 mb-6 font-medium">Has encontrado todas las palabras.</p>

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

            {/* Panel de Palabras */}
            <div className="w-full lg:w-64 xl:w-80 shrink-0 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 order-1 lg:order-2">
                <div className="font-bold text-slate-500 uppercase tracking-widest text-sm mb-4 border-b pb-4">
                    Palabras a encontrar ({foundWords.length}/{wordsToFind.length})
                </div>
                <div className="flex flex-row lg:flex-col flex-wrap gap-2 lg:gap-3 flex-1 items-start content-start">
                    {wordsToFind.map((word, idx) => {
                        const isFound = foundWords.includes(word);
                        return (
                            <div
                                key={idx}
                                className={`px-4 py-2 lg:py-3 lg:w-full rounded-xl font-bold font-mono text-lg transition-all ${isFound ? 'bg-emerald-50 text-emerald-400 line-through decoration-2' : 'bg-slate-50 text-slate-700 shadow-sm'}`}
                            >
                                {word}
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}
