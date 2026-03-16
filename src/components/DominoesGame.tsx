import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEduMate } from '../context/EduMateContext';
import { PlayCircle, Hand, AlertCircle, RefreshCw, XCircle, Grid3X3, Zap, CopySlash } from 'lucide-react';

export type DominoTile = [number, number];
export type TileWithId = { id: string, values: DominoTile };

// Helper to generate 28 domino tiles
const generateTiles = (): TileWithId[] => {
    const tiles: TileWithId[] = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) {
            tiles.push({ id: `${i}-${j}`, values: [i, j] });
        }
    }
    return tiles;
};

// Shuffle an array
const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Visual Component for a Domino Tile
const DominoTileComponent = ({ tile, isHorizontal = false, onClick, disabled = false, hidden = false }: { tile: DominoTile, isHorizontal?: boolean, onClick?: () => void, disabled?: boolean, hidden?: boolean }) => {
    if (hidden) {
        return (
            <div className={`
                ${isHorizontal ? 'w-16 h-8 flex-row' : 'w-8 h-16 flex-col'}
                bg-indigo-600 rounded shadow-md border-2 border-indigo-700 flex items-center justify-center opacity-90 flex-shrink-0
            `}>
                <span className="text-white/50 text-xs font-bold">EduMate</span>
            </div>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                ${isHorizontal ? 'w-16 h-8 flex-row' : 'w-8 h-16 flex-col'}
                bg-white border-2 border-slate-800 rounded shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-between
                transition-transform ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 cursor-pointer'}
            `}
        >
            <div className={`flex-1 flex items-center justify-center text-2xl font-bold text-slate-800 w-full h-full ${isHorizontal ? 'w-8' : 'h-8'}`}>
                {tile[0]}
            </div>
            <div className={`bg-slate-800 shrink-0 ${isHorizontal ? 'w-[2px] h-full' : 'h-[2px] w-full'}`} />
            <div className={`flex-1 flex items-center justify-center text-2xl font-bold text-slate-800 w-full h-full ${isHorizontal ? 'w-8' : 'h-8'}`}>
                {tile[1]}
            </div>
        </button>
    );
};

export default function DominoesGame() {
    const { updateUserStats, aiName } = useEduMate();
    const companionName = aiName || 'Morgan';
    
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
    const [winner, setWinner] = useState<'player' | 'cpu' | 'draw' | null>(null);

    const [playerHand, setPlayerHand] = useState<TileWithId[]>([]);
    const [cpuHand, setCpuHand] = useState<TileWithId[]>([]);
    const [boneyard, setBoneyard] = useState<TileWithId[]>([]);
    
    // The board where tiles are played, represented logically (left to right)
    // To properly display the board, we need to track if a tile was flipped to match
    const [board, setBoard] = useState<{ id: string, values: DominoTile }[]>([]);

    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
    const [isThinking, setIsThinking] = useState(false);
    const [choosingEndForTile, setChoosingEndForTile] = useState<TileWithId | null>(null);
    
    const boardEndRef = useRef<HTMLDivElement>(null);

    // Scroll to new tile when played
    useEffect(() => {
        if (board.length > 0) {
            boardEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
        }
    }, [board]);

    const startGame = () => {
        const allTiles = shuffle(generateTiles());
        const newPlayerHand = allTiles.slice(0, 7);
        const newCpuHand = allTiles.slice(7, 14);
        const newBoneyard = allTiles.slice(14);

        setPlayerHand(newPlayerHand);
        setCpuHand(newCpuHand);
        setBoneyard(newBoneyard);
        setBoard([]);
        
        // Determine starting player based on highest double (simple logic: player starts for now)
        setIsPlayerTurn(true);
        setWinner(null);
        setGameState('playing');
        setIsThinking(false);
    };

    const leftEnd = board.length > 0 ? board[0].values[0] : null;
    const rightEnd = board.length > 0 ? board[board.length - 1].values[1] : null;

    // Checks if a tile can be played. Returns 'left', 'right', or false.
    const getPlayableSide = (tile: DominoTile): 'left' | 'right' | false => {
        if (board.length === 0) return 'right'; // First tile can go anywhere

        const [a, b] = tile;
        
        // Check right side first
        if (a === rightEnd || b === rightEnd) return 'right';
        // Then check left side
        if (a === leftEnd || b === leftEnd) return 'left';
        
        return false;
    };

    const isTilePlayable = (tile: DominoTile): boolean => {
        return getPlayableSide(tile) !== false;
    };

    const playTile = (tileObj: TileWithId, player: 'player' | 'cpu', forceSide?: 'left' | 'right') => {
        let side = forceSide || getPlayableSide(tileObj.values);
        if (!side) return false;

        let newValues: DominoTile = [...tileObj.values] as DominoTile;
        
        if (board.length === 0) {
            // First tile
            setBoard([{ id: tileObj.id, values: newValues }]);
        } else if (side === 'right') {
            if (newValues[0] !== rightEnd) { // Needs flipping
                newValues = [newValues[1], newValues[0]];
            }
            setBoard(prev => [...prev, { id: tileObj.id, values: newValues }]);
        } else if (side === 'left') {
            if (newValues[1] !== leftEnd) { // Needs flipping
                newValues = [newValues[1], newValues[0]];
            }
            setBoard(prev => [{ id: tileObj.id, values: newValues }, ...prev]);
        }

        if (player === 'player') {
            setPlayerHand(prev => prev.filter(t => t.id !== tileObj.id));
            setChoosingEndForTile(null);
            setIsPlayerTurn(false);
        } else {
            setCpuHand(prev => prev.filter(t => t.id !== tileObj.id));
            setIsPlayerTurn(true);
        }
        
        return true;
    };

    const handlePlayerTileClick = (tileObj: TileWithId) => {
        if (!isPlayerTurn || board.length === 0) {
            if (board.length === 0) playTile(tileObj, 'player');
            return;
        }

        const [a, b] = tileObj.values;
        const matchesRight = (a === rightEnd || b === rightEnd);
        const matchesLeft = (a === leftEnd || b === leftEnd);

        if (matchesLeft && matchesRight && leftEnd !== rightEnd) {
            setChoosingEndForTile(tileObj);
        } else if (matchesRight) {
            playTile(tileObj, 'player', 'right');
        } else if (matchesLeft) {
            playTile(tileObj, 'player', 'left');
        }
    };

    const drawFromBoneyard = (player: 'player' | 'cpu') => {
        if (boneyard.length === 0) return false;
        
        const drawnTile = boneyard[0];
        setBoneyard(prev => prev.slice(1));
        
        if (player === 'player') {
            setPlayerHand(prev => [...prev, drawnTile]);
        } else {
            setCpuHand(prev => [...prev, drawnTile]);
        }
        return true;
    };

    const handlePlayerPass = () => {
        if (boneyard.length > 0) {
            drawFromBoneyard('player');
        } else {
            // Can't draw and can't play, pass turn
            setIsPlayerTurn(false);
        }
    };

    // CPU Logic
    useEffect(() => {
        if (gameState !== 'playing' || isPlayerTurn || isThinking || choosingEndForTile) return;

        const makeCPUMove = async () => {
            setIsThinking(true);
            // Simulate 'thinking' delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Find a playable tile
            const playableTile = cpuHand.find(t => isTilePlayable(t.values));
            
            if (playableTile) {
                playTile(playableTile, 'cpu');
            } else if (boneyard.length > 0) {
                // Draw
                setBoneyard(prev => {
                    const newBoneyard = [...prev];
                    const drawn = newBoneyard.shift();
                    if (drawn) {
                        setCpuHand(ch => [...ch, drawn]);
                    }
                    return newBoneyard;
                });
                // After drawing, CPU turn continues (will re-evaluate on next render cycle due to state update? Let's keep logic simple: draw and pass if still can't play, or just draw and try next tick)
                // Actually to simulate correct dominoes, you draw until you can play.
                // We'll trust the useEffect to trigger again since isPlayerTurn is still false.
            } else {
                // Pass
                setIsPlayerTurn(true);
            }
            
            setIsThinking(false);
        };

        makeCPUMove();
    }, [isPlayerTurn, gameState, isThinking, cpuHand, boneyard, leftEnd, rightEnd]);

    // Check Win Conditions
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (playerHand.length === 0) {
            setWinner('player');
            setGameState('ended');
            updateUserStats(true);
            return;
        }
        if (cpuHand.length === 0) {
            setWinner('cpu');
            setGameState('ended');
            updateUserStats(false);
            return;
        }

        // Check for blocked game
        const playerCanPlay = playerHand.some(t => isTilePlayable(t.values));
        const cpuCanPlay = cpuHand.some(t => isTilePlayable(t.values));
        
        if (!playerCanPlay && !cpuCanPlay && boneyard.length === 0) {
            // Blocked. Count pips.
            const playerPips = playerHand.reduce((acc, t) => acc + t.values[0] + t.values[1], 0);
            const cpuPips = cpuHand.reduce((acc, t) => acc + t.values[0] + t.values[1], 0);
            
            if (playerPips < cpuPips) {
                setWinner('player');
                updateUserStats(true);
            } else if (cpuPips < playerPips) {
                setWinner('cpu');
                updateUserStats(false);
            } else {
                setWinner('draw');
                updateUserStats(false); // maybe give half point?
            }
            setGameState('ended');
        }
    }, [playerHand, cpuHand, boneyard, leftEnd, rightEnd, gameState]);

    if (gameState === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-in zoom-in-95 duration-500">
                <div className="bg-white p-10 rounded-3xl border-2 border-indigo-100 text-center w-full max-w-lg shadow-sm">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Grid3X3 className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 mb-4">Dominó Clásico</h2>
                    <p className="text-xl text-slate-500 mb-8 font-medium">Juega un 1 contra 1. Coloca todas tus fichas uniendo los números coincidentes de los extremos.</p>
                    <button onClick={startGame} className="px-8 py-5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-white text-2xl shadow-md w-full transition-transform active:scale-95 flex items-center justify-center gap-3">
                        <PlayCircle className="w-8 h-8" />
                        Repartir Fichas
                    </button>
                </div>
            </div>
        );
    }



    const canPlayerMove = playerHand.some(t => isTilePlayable(t.values));

    return (
        <div className="h-full w-full flex flex-col min-h-0 bg-slate-50 relative">
            
            {/* Header / CPU Area & Board (Grows) */}
            <div className="flex-grow flex flex-col p-4 bg-slate-100 rounded-b-3xl min-h-0 relative">
                
                <div className="flex items-center justify-between w-full max-w-4xl mx-auto bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold">
                            M
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 leading-tight">{companionName} (CPU)</p>
                            <p className="text-xs text-slate-500">{cpuHand.length} fichas restantes</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-100 p-2 rounded-xl gap-2 items-center">
                        <div className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-lg text-sm border border-indigo-200 shadow-sm flex gap-1 items-center">
                            Pozo: {boneyard.length} <Grid3X3 className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* CPU Hand Mockup (hidden) */}
                <div className="flex justify-center items-center gap-1 mb-4 w-full px-4 overflow-x-auto no-scrollbar shrink-0">
                    {cpuHand.map((t, idx) => (
                        <div key={idx} className="shrink-0 transition-transform">
                            <DominoTileComponent tile={t.values} hidden={true} />
                        </div>
                    ))}
                    {cpuHand.length === 0 && <span className="text-slate-400 font-medium">Sin fichas</span>}
                </div>

                {/* Board Area */}
                <div className="flex-1 flex flex-wrap justify-start content-start items-center gap-1 px-8 py-4 w-full h-full bg-slate-100 rounded-xl relative overflow-y-auto custom-scrollbar">
                
                {board.length === 0 ? (
                    <div className="m-auto text-slate-400 font-bold text-xl uppercase tracking-widest bg-white/50 px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
                        La mesa está vacía. Juega tu primera ficha.
                    </div>
                ) : (
                    <>
                        {board.map((t, idx) => {
                            const isDouble = t.values[0] === t.values[1];
                            return (
                                <div key={t.id} className="shrink-0 transition-all animate-in fade-in zoom-in">
                                    <DominoTileComponent tile={t.values} isHorizontal={!isDouble} />
                                </div>
                            );
                        })}
                        <div ref={boardEndRef} className="w-0 shrink-0" />
                    </>
                )}
                </div>
                
                
                {/* Overlay for Double Match Choice */}
                {choosingEndForTile && (
                    <div className="absolute inset-0 z-20 flex items-center justify-between px-8 pointer-events-none">
                        <button
                            onClick={() => playTile(choosingEndForTile, 'player', 'left')}
                            className="pointer-events-auto bg-white hover:bg-indigo-50 text-indigo-700 border-2 border-indigo-200 px-6 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-3 text-lg sm:text-2xl"
                        >
                            <Hand className="w-8 h-8" /> ← Jugar Izquierda
                        </button>
                        <button
                            onClick={() => playTile(choosingEndForTile, 'player', 'right')}
                            className="pointer-events-auto bg-white hover:bg-indigo-50 text-indigo-700 border-2 border-indigo-200 px-6 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-3 text-lg sm:text-2xl"
                        >
                            Jugar Derecha → <Hand className="w-8 h-8" />
                        </button>
                    </div>
                )}
            </div>

            {/* Player Area or End Game Screen (Fixed Bottom) */}
            <div className={`h-[140px] flex-shrink-0 flex flex-col justify-center items-center gap-2 p-2 bg-white border-t-4 z-10 transition-colors ${gameState === 'ended' ? (winner === 'player' ? 'border-emerald-500 bg-emerald-50/50' : winner === 'draw' ? 'border-amber-500 bg-amber-50/50' : 'border-rose-500 bg-rose-50/50') : isPlayerTurn ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200'}`}>
                
                {gameState === 'ended' ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl px-4 animate-in slide-in-from-bottom-2">
                        <div className="text-center sm:text-left mb-2 sm:mb-0">
                            <h3 className={`font-black text-2xl ${winner === 'player' ? 'text-emerald-700' : winner === 'draw' ? 'text-amber-700' : 'text-rose-700'}`}>
                                {winner === 'player' ? '¡Has Ganado! 🎉' : winner === 'draw' ? 'Empate 🤝' : `Gana ${companionName} 😢`}
                            </h3>
                            <p className={`font-medium ${winner === 'player' ? 'text-emerald-600' : winner === 'draw' ? 'text-amber-600' : 'text-rose-600'}`}>
                                {winner === 'player' ? '¡Excelente estrategia! Te has quedado sin fichas.' : winner === 'draw' ? 'Partida bloqueada. Empate a puntos.' : 'Sigue practicando tu estrategia visual.'}
                            </p>
                        </div>
                        <button onClick={startGame} className={`px-8 py-3 text-white rounded-xl font-bold text-xl shadow hover:-translate-y-1 transition-transform flex items-center gap-2 ${winner === 'player' ? 'bg-emerald-600 hover:bg-emerald-700' : winner === 'draw' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
                            <RefreshCw className="w-5 h-5" /> Volver a Jugar
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center w-full max-w-4xl px-4">
                            <h3 className="font-black text-slate-800 text-xl">{isPlayerTurn ? 'Tu turno' : 'Esperando...'}</h3>
                            
                            {!canPlayerMove && isPlayerTurn && (
                                <button
                                    onClick={handlePlayerPass}
                                    className="bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 px-6 py-2 rounded-xl font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 animate-pulse"
                                >
                                    {boneyard.length > 0 ? (
                                        <>Robar del Pozo ({boneyard.length}) <RefreshCw className="w-4 h-4" /></>
                                    ) : (
                                        <>Pasar Turno <CopySlash className="w-4 h-4" /></>
                                    )}
                                </button>
                            )}
                        </div>

                        <div className="flex justify-center items-center gap-2 w-full max-w-4xl overflow-x-auto px-2 no-scrollbar">
                            {playerHand.map(t => {
                                const isPlayable = (isPlayerTurn && isTilePlayable(t.values) || board.length === 0) && !choosingEndForTile;
                                return (
                                    <DominoTileComponent 
                                        key={t.id}
                                        tile={t.values} 
                                        onClick={() => isPlayable ? handlePlayerTileClick(t) : null}
                                        disabled={!isPlayable || !isPlayerTurn}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
