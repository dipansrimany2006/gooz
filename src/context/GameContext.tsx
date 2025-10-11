'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

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

  // Wallet State
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;

  // WebSocket State
  wsConnected: boolean;
  sendMessage: (message: any) => boolean;

  // Game Creator
  creatorId: string | null;
  setCreatorId: (id: string | null) => void;

  // Pending Actions
  pendingAction: string | null;
  setPendingAction: (action: string | null) => void;

  // Jail State
  inJail: boolean;
  setInJail: (inJail: boolean) => void;

  // Insufficient Funds State
  insufficientFunds: {
    rentAmount: number;
    currentMoney: number;
    ownedProperties: string[];
  } | null;
  setInsufficientFunds: (data: any) => void;

  // Chat Messages
  chatMessages: Array<{
    playerId: string;
    playerName: string;
    message: string;
    timestamp: string;
  }>;
  addChatMessage: (message: any) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [serverPlayers, setServerPlayers] = useState<Player[]>([]);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [inJail, setInJail] = useState<boolean>(false);
  const [insufficientFunds, setInsufficientFunds] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<Array<{
    playerId: string;
    playerName: string;
    message: string;
    timestamp: string;
  }>>([]);

  const addChatMessage = useCallback((message: any) => {
    setChatMessages(prev => [...prev, message]);
  }, []);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message: any) => {
    console.log('🎮 Game message received:', message.type, message);

    switch (message.type) {
      case 'GAME_CREATED':
        setGameId(message.gameId);
        setCreatorId(message.playerId);
        localStorage.setItem('gameId', message.gameId);
        console.log('✅ Game created:', message.gameId);
        break;

      case 'PLAYER_JOINED':
        setServerPlayers(message.players || []);
        console.log('✅ Player joined. Total players:', message.players?.length);
        break;

      case 'GAME_STARTED':
        setCurrentPlayer(message.currentPlayer?.id || null);
        setServerPlayers(message.players || []);
        console.log('🎮 Game started! Current player:', message.currentPlayer?.name);
        break;

      case 'DICE_ROLLED':
        setDiceRoll(message.diceRoll);
        setCurrentPlayer(message.playerId);
        // Update player positions
        if (message.player) {
          setServerPlayers(prev =>
            prev.map(p => p.id === message.playerId ? { ...p, position: message.newPosition } : p)
          );
        }
        console.log('🎲 Dice rolled:', message.diceRoll, 'New position:', message.newPosition);
        break;

      case 'BUY_OR_PASS':
        setPendingAction('BUY_OR_PASS');
        console.log('🏠 Buy or pass decision required for:', message.block?.name);
        break;

      case 'PROPERTY_BOUGHT':
        setPendingAction(null);
        setServerPlayers(prev =>
          prev.map(p => p.id === message.playerId ? message.player : p)
        );
        console.log('✅ Property bought:', message.blockName);
        break;

      case 'PROPERTY_PASSED':
        setPendingAction(null);
        console.log('⏭️ Property passed:', message.blockName);
        break;

      case 'PROPERTY_SOLD':
        setServerPlayers(prev =>
          prev.map(p => p.id === message.playerId ? message.player : p)
        );
        console.log('💰 Property sold:', message.blockName, 'for', message.sellPrice);
        break;

      case 'RENT_PAID':
        setServerPlayers(prev =>
          prev.map(p => {
            if (p.id === message.payerId) return message.payer;
            if (p.id === message.ownerId) return message.owner;
            return p;
          })
        );
        console.log('💸 Rent paid:', message.amount, 'for', message.blockName);
        break;

      case 'NEXT_TURN':
        setCurrentPlayer(message.currentPlayer?.id || null);
        setServerPlayers(message.players || []);
        setPendingAction(null);
        setDiceRoll(null);
        console.log('➡️ Next turn:', message.currentPlayer?.name);
        break;

      case 'PASSED_GO':
        console.log('🎉 Player passed GO! Collected:', message.amount);
        break;

      case 'CORNER_BLOCK_EFFECT':
        console.log('🎯 Corner block effect:', message.blockName, message.amountChange);
        break;

      case 'PLAYER_BANKRUPT':
        setServerPlayers(message.players || []);
        console.log('💔 Player bankrupt:', message.playerName);
        break;

      case 'GAME_ENDED':
        console.log('🏆 Game ended! Winner:', message.winnerName);
        break;

      case 'INSUFFICIENT_FUNDS':
        setInsufficientFunds({
          rentAmount: message.rentAmount,
          currentMoney: message.currentMoney,
          ownedProperties: message.ownedProperties || [],
        });
        console.log('💰 Insufficient funds! Must sell properties or go bankrupt');
        break;

      case 'JAIL_CHOICE':
        setInJail(true);
        setPendingAction('JAIL_CHOICE');
        console.log('🔒 Player in jail! Choose to pay or roll');
        break;

      case 'JAIL_ROLL_RESULT':
        if (message.escaped) {
          setInJail(false);
          setPendingAction(null);
        }
        console.log(`🎲 Jail roll: ${message.diceRoll} - ${message.escaped ? 'ESCAPED!' : 'Still in jail'}`);
        break;

      case 'MESSAGE':
        addChatMessage({
          playerId: message.playerId,
          playerName: message.playerName,
          message: message.message,
          timestamp: message.timestamp || new Date().toISOString(),
        });
        console.log(`💬 Chat message from ${message.playerName}: ${message.message}`);
        break;

      case 'ERROR':
        console.error('❌ Server error:', message.message);
        break;

      default:
        console.log('📩 Unhandled message type:', message.type);
    }
  }, []);

  // Initialize WebSocket connection
  const { isConnected: wsConnected, sendMessage } = useWebSocket('ws://localhost:8080', {
    onMessage: handleWebSocketMessage,
    onOpen: () => console.log('🔌 Connected to game server'),
    onClose: () => console.log('🔌 Disconnected from game server'),
    autoConnect: true,
  });

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
    walletAddress,
    setWalletAddress,
    isConnected,
    setIsConnected,
    wsConnected,
    sendMessage,
    creatorId,
    setCreatorId,
    pendingAction,
    setPendingAction,
    inJail,
    setInJail,
    insufficientFunds,
    setInsufficientFunds,
    chatMessages,
    addChatMessage,
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