import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEduMate } from '../context/EduMateContext';
import { PlayCircle, Trophy, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface Cell {
    x: number;
    y: number;
    walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
    visited: boolean;
}

interface Position {
    x: number;
    y: number;
}

const GRID_SIZE = 25;

export default function MazeGame() {
    const { updateUserStats } = useEduMate();
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');
    const [maze, setMaze] = useState<Cell[]>([]);
    const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
    const [goalPosition] = useState<Position>({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

    // --- Time and Records State ---
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [records, setRecords] = useState<number[]>([]);

    useEffect(() => {
        const storedRecords = localStorage.getItem('edumate_maze_records');
        if (storedRecords) {
            try {
                setRecords(JSON.parse(storedRecords));
            } catch (e) {
                console.error("Error parsing maze records", e);
            }
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && gameState === 'playing') {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, gameState]);

    useEffect(() => {
        if (gameState === 'won') {
            setIsTimerActive(false);
            const storedRecords = JSON.parse(localStorage.getItem('edumate_maze_records') || '[]') as number[];
            const newRecords = [...storedRecords, timeElapsed]
                .sort((a, b) => a - b)
                .slice(0, 5);
            localStorage.setItem('edumate_maze_records', JSON.stringify(newRecords));
            setRecords(newRecords);

            // Execute the context update here safely outside the main render/state updater loop
            updateUserStats(true);
        }
    }, [gameState, timeElapsed, updateUserStats]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- Maze Generation ---
    const generateMaze = useCallback(() => {
        // Initialize grid
        const grid: Cell[] = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                grid.push({
                    x,
                    y,
                    walls: { top: true, right: true, bottom: true, left: true },
                    visited: false,
                });
            }
        }

        const getCell = (x: number, y: number) => {
            if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return null;
            return grid[x + y * GRID_SIZE];
        };

        const getUnvisitedNeighbors = (cell: Cell) => {
            const neighbors: Cell[] = [];
            const top = getCell(cell.x, cell.y - 1);
            const right = getCell(cell.x + 1, cell.y);
            const bottom = getCell(cell.x, cell.y + 1);
            const left = getCell(cell.x - 1, cell.y);

            if (top && !top.visited) neighbors.push(top);
            if (right && !right.visited) neighbors.push(right);
            if (bottom && !bottom.visited) neighbors.push(bottom);
            if (left && !left.visited) neighbors.push(left);

            return neighbors;
        };

        const current = getCell(0, 0)!;
        current.visited = true;
        const stack: Cell[] = [current];

        while (stack.length > 0) {
            const curr = stack.pop()!;
            const neighbors = getUnvisitedNeighbors(curr);

            if (neighbors.length > 0) {
                stack.push(curr);
                // Choose a random neighbor
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];

                // Remove walls between curr and next
                if (next.x === curr.x && next.y === curr.y - 1) { // Next is Top
                    curr.walls.top = false;
                    next.walls.bottom = false;
                } else if (next.x === curr.x + 1 && next.y === curr.y) { // Next is Right
                    curr.walls.right = false;
                    next.walls.left = false;
                } else if (next.x === curr.x && next.y === curr.y + 1) { // Next is Bottom
                    curr.walls.bottom = false;
                    next.walls.top = false;
                } else if (next.x === curr.x - 1 && next.y === curr.y) { // Next is Left
                    curr.walls.left = false;
                    next.walls.right = false;
                }

                next.visited = true;
                stack.push(next);
            }
        }

        setMaze(grid);
    }, []);

    // --- Game Logic ---
    const startGame = () => {
        generateMaze();
        setPlayerPosition({ x: 0, y: 0 });
        setTimeElapsed(0);
        setIsTimerActive(false);
        setGameState('playing');

        // Ensure the game area is focused so keyboard events work immediately
        setTimeout(() => {
            gameAreaRef.current?.focus();
        }, 100);
    };

    const getCellAt = (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return null;
        return maze[x + y * GRID_SIZE];
    };

    const movePlayer = useCallback((dx: number, dy: number) => {
        if (gameState !== 'playing') return;
        setIsTimerActive(true);

        setPlayerPosition(prev => {
            const currentCell = getCellAt(prev.x, prev.y);
            if (!currentCell) return prev; // Should not happen

            // Check walls
            if (dx === 0 && dy === -1 && currentCell.walls.top) return prev; // Up
            if (dx === 1 && dy === 0 && currentCell.walls.right) return prev; // Right
            if (dx === 0 && dy === 1 && currentCell.walls.bottom) return prev; // Down
            if (dx === -1 && dy === 0 && currentCell.walls.left) return prev; // Left

            const nextX = prev.x + dx;
            const nextY = prev.y + dy;

            // Check bounds (redundant but safe)
            if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) return prev;

            // Check win condition
            if (nextX === goalPosition.x && nextY === goalPosition.y) {
                setGameState('won');
                // Removed updateUserStats(true) from here to prevent React warnings.
                // It's handled by the useEffect that watches gameState === 'won'.
            }

            return { x: nextX, y: nextY };
        });
    }, [gameState, maze, getCellAt, goalPosition]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;

            // Prevent default scrolling for arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case 'ArrowUp': movePlayer(0, -1); break;
                case 'ArrowDown': movePlayer(0, 1); break;
                case 'ArrowLeft': movePlayer(-1, 0); break;
                case 'ArrowRight': movePlayer(1, 0); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, movePlayer]);

    // Touch controls
    const handleTouchStart = (e: React.TouchEvent) => {
        if (gameState !== 'playing') return;
        setTouchStart({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (gameState !== 'playing' || !touchStart) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const dx = touchEndX - touchStart.x;
        const dy = touchEndY - touchStart.y;

        // Minimum swipe distance to register
        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
            setTouchStart(null);
            return;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 0) movePlayer(1, 0); // Right
            else movePlayer(-1, 0); // Left
        } else {
            // Vertical swipe
            if (dy > 0) movePlayer(0, 1); // Down
            else movePlayer(0, -1); // Up
        }

        setTouchStart(null);
    };

    // --- Rendering ---
    if (gameState === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-in zoom-in-95 duration-500">
                <div className="bg-white p-10 rounded-3xl border-2 border-indigo-100 text-center w-full max-w-lg shadow-sm">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <PlayCircle className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 mb-4">Laberinto</h2>
                    <p className="text-xl text-slate-500 mb-8 font-medium">Encuentra el camino desde la entrada hasta la salida. ¡Mueve tu ficha usando los botones o las flechas!</p>
                    <button onClick={startGame} className="px-8 py-5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-white text-2xl shadow-md w-full transition-transform active:scale-95">
                        ¡Comenzar!
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col flex-1 h-full min-h-0 items-center justify-center p-2 sm:p-4 overflow-hidden relative animate-in fade-in duration-500"
            tabIndex={0}
            ref={gameAreaRef}
            style={{ outline: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Header / Top Info Area - Optional for touch clarity but requested UI cleanup */}
            {(gameState === 'playing' || gameState === 'won') && (
                <div className="flex-shrink-0 w-full max-w-[min(100%,_80vh)] mx-auto flex justify-between items-center mb-2 px-2 z-10 hidden sm:flex">
                    <div className="text-sm font-bold text-slate-500 bg-white/80 p-2 rounded-xl shadow-sm backdrop-blur-sm pointer-events-none">
                        Controles: Flechas o deslizar
                    </div>
                </div>
            )}

            {/* Header Seguro (Timer & Reset) */}
            {(gameState === 'playing' || gameState === 'won') && (
                <div className="flex-shrink-0 w-full max-w-[min(100%,_80vh)] mx-auto flex justify-between items-center mb-2 px-2 z-10">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 font-black text-slate-700 text-lg flex items-center gap-2">
                        ⏱️ {formatTime(timeElapsed)}
                    </div>
                    <button
                        onClick={startGame}
                        className="bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl shadow-sm border border-slate-200 font-bold text-sm flex items-center gap-2 transition-colors active:scale-95"
                    >
                        <RotateCcw className="w-4 h-4" /> Reiniciar
                    </button>
                </div>
            )
            }

            {/* Maze Area */}
            <div
                className="grid w-full aspect-square mx-auto max-w-[min(100%,_80vh)] bg-white border-[3px] border-slate-800 shadow-xl relative"
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
                }}
            >
                {/* Scoreboard Overlay */}
                {gameState === 'won' && (
                    <div className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center rounded-sm animate-in zoom-in-95 duration-300 p-6">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border-2 border-emerald-200 text-emerald-600 shrink-0">
                            <Trophy className="w-10 h-10" />
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">¡Meta alcanzada!</h4>
                        <p className="text-lg sm:text-xl font-bold text-slate-600 mb-6">Tu tiempo: <span className="text-emerald-600">{formatTime(timeElapsed)}</span></p>

                        <div className="w-full max-w-xs bg-slate-50 rounded-2xl border border-slate-200 p-3 sm:p-4 mb-6 shadow-inner flex-1 min-h-0 overflow-y-auto">
                            <h5 className="font-bold text-slate-700 text-center mb-3">🏆 Top Mejores Tiempos</h5>
                            <div className="flex flex-col gap-2">
                                {records.map((record, index) => (
                                    <div key={index} className="flex justify-between items-center bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <span className={`${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-700' : 'text-slate-500'}`}>
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <span>{formatTime(record)}</span>
                                    </div>
                                ))}
                                {records.length === 0 && (
                                    <div className="text-center text-slate-400 text-sm py-2">Sin récords todavía</div>
                                )}
                            </div>
                        </div>

                        <button onClick={startGame} className="px-6 py-3 sm:px-8 sm:py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black text-white text-lg sm:text-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-3 shrink-0">
                            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" /> Jugar de Nuevo
                        </button>
                    </div>
                )}
                {maze.map((cell, i) => {
                    const isPlayer = playerPosition.x === cell.x && playerPosition.y === cell.y;
                    const isGoal = goalPosition.x === cell.x && goalPosition.y === cell.y;

                    // Wall classes logic (thinner borders)
                    let wallClasses = "";
                    if (cell.walls.top) wallClasses += " border-t-[1px] border-t-slate-800";
                    if (cell.walls.right) wallClasses += " border-r-[1px] border-r-slate-800";
                    if (cell.walls.bottom) wallClasses += " border-b-[1px] border-b-slate-800";
                    if (cell.walls.left) wallClasses += " border-l-[1px] border-l-slate-800";

                    return (
                        <div
                            key={i}
                            className={`w-full h-full relative flex items-center justify-center bg-slate-50 ${wallClasses} box-border`}
                            style={{
                                // ensure borders don't ruin flex perfectly 
                                borderTopColor: cell.walls.top ? '#1e293b' : 'transparent',
                                borderRightColor: cell.walls.right ? '#1e293b' : 'transparent',
                                borderBottomColor: cell.walls.bottom ? '#1e293b' : 'transparent',
                                borderLeftColor: cell.walls.left ? '#1e293b' : 'transparent',
                            }}
                        >
                            {isPlayer && (
                                <div className="w-[80%] h-[80%] bg-blue-500 rounded-full shadow-sm animate-in zoom-in z-10 duration-200"></div>
                            )}
                            {isGoal && !isPlayer && (
                                <div className="w-[80%] h-[80%] bg-emerald-400 rotate-45 rounded-sm shadow-sm opacity-80 z-0 relative">
                                    <div className="absolute inset-2 bg-white rounded-full opacity-50"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

        </div >
    );
}
