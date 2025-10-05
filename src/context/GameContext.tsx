'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  position: number;
  colorCode: string;
  poolAmt: number;
}

interface PlayerPosition {
  playerId: string;
  name: string;
  colorCode: string;
  currentPosition: number;
  targetPosition?: number;
}

interface GameContextType {
  // Game State
  gameId: string | null;
  setGameId: (id: string | null) => void;
  currentPlayer: string | null;
  setCurrentPlayer: (playerId: string | null) => void;

  // Player Data
  playerPositions: PlayerPosition[];
  setPlayerPositions: React.Dispatch<React.SetStateAction<PlayerPosition[]>>;
  serverPlayers: Player[];
  setServerPlayers: (players: Player[]) => void;

  // Game Actions
  diceRoll: number | null;
  setDiceRoll: (roll: number | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [serverPlayers, setServerPlayers] = useState<Player[]>([]);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);

  // Load gameId from localStorage on mount
  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId');
    if (storedGameId && !gameId) {
      setGameId(storedGameId);
      console.log('GameProvider - Loaded gameId from localStorage:', storedGameId);
    }
  }, [gameId]);

  const value: GameContextType = {
    gameId,
    setGameId,
    currentPlayer,
    setCurrentPlayer,
    playerPositions,
    setPlayerPositions,
    serverPlayers,
    setServerPlayers,
    diceRoll,
    setDiceRoll,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};