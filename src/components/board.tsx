'use client'
import React, { useState, useEffect } from 'react'
import Card from './card'
import CardModal from './cardmodal'
import { Button } from './ui/button'
import { GAME_CONFIG, POSITION_MAPPING } from '../config/gameConfig'
import { useGame } from '../context/GameContext'
import { useWallet } from '../context/WalletProvider'

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

const Board = () => {
  // Use shared game context
  const {
    ws, setWs,
    isConnected, setIsConnected,
    gameId, setGameId,
    currentPlayer, setCurrentPlayer,
    playerPositions, setPlayerPositions,
    serverPlayers, setServerPlayers,
    diceRoll, setDiceRoll
  } = useGame();

  // Get wallet information for player ID
  const { accountId } = useWallet();


  // Game settings from config
  const { WS_URL, AUTO_CREATE_GAME, AUTO_JOIN_EXISTING } = GAME_CONFIG;

  // Position mapping: Server (20 positions) → Frontend (15 positions)
  const mapServerToFrontend = (serverPosition: number): number => {
    return POSITION_MAPPING[serverPosition as keyof typeof POSITION_MAPPING] ?? serverPosition % 15;
  };

  // Sound utility function
  const playSound = async () => {
    try {
      console.log('🔊 Attempting to play sound...');
      const audio = new Audio('/duck-quacking-37392.mp3');

      // Set volume and other properties
      audio.volume = 1.0; // Volume should be between 0.0 and 1.0
      audio.preload = 'auto';

      // Add event listeners for debugging
      audio.addEventListener('loadstart', () => console.log('🔊 Audio loading started'));
      audio.addEventListener('canplay', () => console.log('🔊 Audio can play'));
      audio.addEventListener('error', (e) => console.error('🔊 Audio error:', e));

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        await playPromise;
        console.log('🔊 Sound played successfully!');
      }
    } catch (error) {
      console.error('🔊 Sound play failed:', error);

      // Fallback: Try with original filename
      try {
        console.log('🔊 Trying fallback audio path...');
        const fallbackAudio = new Audio('/BEASTBOYSHUB quack duck sound #nocopyright plz subscribe.mp3');
        fallbackAudio.volume = 0.5;
        await fallbackAudio.play();
        console.log('🔊 Fallback sound played successfully!');
      } catch (fallbackError) {
        console.error('🔊 Fallback sound also failed:', fallbackError);
      }
    }
  };

  const rollDice = () => {
    console.log('🎲 DICE ROLL DEBUG:');
    console.log('- WebSocket connected:', !!ws);
    console.log('- Game ID:', gameId);
    console.log('- Current Player:', currentPlayer);
    console.log('- Player ID (accountId):', accountId);
    console.log('- Is my turn?:', currentPlayer === accountId);

    if (ws && gameId && currentPlayer === accountId && accountId) {
      // Play sound when rolling dice
      playSound();

      const message = {
        type: 'ROLL_DICE',
        gameId: gameId,
        playerId: accountId
      };
      console.log('📤 Sending dice roll request:', message);
      ws.send(JSON.stringify(message));
    } else {
      console.log('❌ Cannot roll dice:');
      console.log('  - WebSocket:', ws ? 'Connected' : 'Disconnected');
      console.log('  - Game ID:', gameId ? gameId : 'Missing');
      console.log('  - Account ID:', accountId ? accountId : 'Not connected');
      console.log('  - Turn check:', currentPlayer === accountId ? 'My turn' : 'Not my turn');
    }
  };

  // Manual join game function for testing
  const joinGame = () => {
    if (ws && gameId && accountId) {
      const joinGameMessage = {
        type: 'JOIN_GAME',
        gameId: gameId,
        playerId: accountId,
        playerName: 'player',
        colorCode: '#4ECDC4'
      };
      ws.send(JSON.stringify(joinGameMessage));
      console.log('Manual join game request sent:', joinGameMessage);
    } else {
      console.log('Cannot join - WebSocket not connected, no game ID, or wallet not connected');
    }
  };

  // Buy property function
  const buyProperty = () => {
    if (ws && gameId && accountId) {
      const buyMessage = {
        type: 'BUY_PROPERTY',
        gameId: gameId,
        playerId: accountId
      };
      ws.send(JSON.stringify(buyMessage));
      console.log('🏠 Buy property request sent:', buyMessage);
    }
  };

  // Pass property function
  const passProperty = () => {
    if (ws && gameId && accountId) {
      const passMessage = {
        type: 'PASS_PROPERTY',
        gameId: gameId,
        playerId: accountId
      };
      ws.send(JSON.stringify(passMessage));
      console.log('🚫 Pass property request sent:', passMessage);
    }
  };

  // WebSocket message handler
  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      switch (message.type) {
        case 'GAME_CREATED':
          setGameId(message.gameId);
          if (GAME_CONFIG.ENABLE_CONSOLE_LOGS) {
            console.log('Game created with ID:', message.gameId);
          }
          updateAllPlayerPositions([message.player]);
          setServerPlayers([message.player]); // Update server players
          setCurrentPlayer(message.player.id);
          break;

        case 'GAME_STARTED':
          if (GAME_CONFIG.ENABLE_CONSOLE_LOGS) {
            console.log('Game started!');
          }
          updateAllPlayerPositions(message.players);
          setServerPlayers(message.players); // Update server players
          setCurrentPlayer(message.currentPlayer?.id || null);
          break;

        case 'PLAYER_JOINED':
          if (GAME_CONFIG.ENABLE_CONSOLE_LOGS) {
            console.log('Player joined:', message.player.name);
          }
          updateAllPlayerPositions(message.players);
          setServerPlayers(message.players); // Update server players
          break;

        case 'DICE_ROLLED':
          console.log('📥 DICE_ROLLED message received:');
          console.log('- Dice Roll:', message.diceRoll);
          console.log('- Player ID:', message.playerId);
          console.log('- Server Position:', message.newPosition);
          
          const frontendPosition = mapServerToFrontend(message.newPosition);
          console.log('- Frontend Position:', frontendPosition);
          console.log('- Player Data:', message.player);

          setDiceRoll(message.diceRoll);
          updatePlayerPosition(message.playerId, frontendPosition);
          break;

        case 'NEXT_TURN':
          console.log('Next turn:', message.currentPlayer?.name);
          setCurrentPlayer(message.currentPlayer?.id || null);
          updateAllPlayerPositions(message.players);
          setServerPlayers(message.players); // Update server players
          break;

        case 'BUY_OR_PASS':
          console.log('🏠 BUY_OR_PASS received:', message);
          if (message.block) {
            setSelectedCard({
              name: message.block.name || 'Property',
              amount: `$${message.block.price || 0}`,
              icon: '/yellow_card.png'
            });
            setIsModalOpen(true);
          }
          break;

        case 'PROPERTY_BOUGHT':
          console.log('🏠 Property bought:', message);
          setIsModalOpen(false);
          setSelectedCard(null);
          break;

        case 'PROPERTY_PASSED':
          console.log('🚫 Property passed:', message);
          setIsModalOpen(false);
          setSelectedCard(null);
          break;

        case 'ERROR':
          console.error('Server error:', message.message);
          break;

        default:
          console.log('Unhandled message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  // Local state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{ name: string; amount: string; icon: string } | null>(null);


  // Initialize demo players at GO (logical position 0, visual position 11)
  // Set up message handler for existing WebSocket connection
  useEffect(() => {
    if (ws) {
      ws.onmessage = handleWebSocketMessage;
    }
  }, [ws]);

  // Expose join function to global scope for testing
  useEffect(() => {
    (window as any).testJoinGame = joinGame;
    (window as any).testRollDice = rollDice;
    return () => {
      delete (window as any).testJoinGame;
      delete (window as any).testRollDice;
    };
  }, [ws, gameId]);

  const updatePlayerPosition = (playerId: string, newPosition: number) => {
    setPlayerPositions((prev: PlayerPosition[]) => prev.map((player: PlayerPosition) =>
      player.playerId === playerId
        ? { ...player, currentPosition: newPosition, targetPosition: newPosition }
        : player
    ));
  };

  const updateAllPlayerPositions = (players: Player[]) => {
    const positions: PlayerPosition[] = players.map(player => ({
      playerId: player.id,
      name: player.name,
      colorCode: player.colorCode,
      currentPosition: mapServerToFrontend(player.position)
    }));
    setPlayerPositions(positions);
  };

  const handleCardClick = (name: string, amount: string, icon: string) => {
    setSelectedCard({ name, amount, icon });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };


  return (
    <div className="bg-[url('/white-bg.png')] bg-contain bg-center bg-no-repeat w-[1000px] h-[800px] relative flex items-center justify-center col-span-4">
      {/* Connection Status */}
      <div className="absolute hidden top-4 right-4 z-20">
        <div className={`px-3 py-1 rounded text-sm font-bold ${
          isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {isConnected ? `Connected (${gameId})` : 'Disconnected'}
        </div>
        {currentPlayer && (
          <div className="px-3 py-1 bg-blue-500 text-white rounded text-xs mt-1">
            Current: {currentPlayer === accountId ? 'YOUR TURN' : 'Waiting'}
          </div>
        )}
        {/* Join Game Button for Testing */}
        {isConnected && (
          <Button
            onClick={joinGame}
            className="mt-2 px-3 py-1 bg-purple-500 text-white text-xs rounded"
          >
            JOIN GAME
          </Button>
        )}
      </div>
        <div className="grid grid-cols-5 grid-rows-4 gap-4 w-full h-full py-16 px-4">
          {/* Top row - 5 cards */}
          <div className="grid place-items-center">
            <Card name="Jail" icon="/yellow_card.png" amount="$0" position={7} players={playerPositions} onClick={() => handleCardClick("Jail", "$0", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="St. James Place" icon="/yellow_card.png" amount="$180" position={8} players={playerPositions} onClick={() => handleCardClick("St. James Place", "$180", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Tennessee Avenue" icon="/yellow_card.png" amount="$180" position={9} players={playerPositions} onClick={() => handleCardClick("Tennessee Avenue", "$180", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="New York Avenue" icon="/yellow_card.png" amount="$200" position={10} players={playerPositions} onClick={() => handleCardClick("New York Avenue", "$200", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Free Parking" icon="/yellow_card.png" amount="$0" position={11} players={playerPositions} onClick={() => handleCardClick("Free Parking", "$0", "/yellow_card.png")} />
          </div>

          {/* Second row - only first and last positions */}
          <div className="grid place-items-center">
            <Card name="Virginia Avenue" icon="/yellow_card.png" amount="$160" position={6} players={playerPositions} onClick={() => handleCardClick("Virginia Avenue", "$160", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center col-span-3 row-span-2 rounded-lg">
              <Button onClick={rollDice} className='relative h-[250px] w-[250px]' disabled={!isConnected || currentPlayer !== accountId}>
                <img src={"/Group 1.png"} alt='' height={250} width={250} className=''/>
                <div className="absolute bottom-1/2 translate-y-full left-3 text-xl font-bold w-24 h-16 flex items-center justify-center">
                  <img src="/brustBubble_gooz 1.png" alt="" height={120} width={96} className="absolute inset-0 object-contain" />
                  <span className="relative rotate-[-25deg] z-10 top-4 -left-2 text-black">
                    {!isConnected ? "Connecting..." :
                      currentPlayer !== accountId ? "Wait Turn" :
                      diceRoll !== null ? `🎲 ${diceRoll}` : "Roll Me"}
                  </span>
                </div>
              </Button>
          </div>
          <div className="grid place-items-center">
            <Card name="Kentucky Avenue" icon="/yellow_card.png" amount="$220" position={12} players={playerPositions} onClick={() => handleCardClick("Kentucky Avenue", "$220", "/yellow_card.png")} />
          </div>

          {/* Third row - only first and last positions */}
          <div className="grid place-items-center">
            <Card name="States Avenue" icon="/yellow_card.png" amount="$140" position={5} players={playerPositions} onClick={() => handleCardClick("States Avenue", "$140", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Atlantic Avenue" icon="/yellow_card.png" amount="$260" position={13} players={playerPositions} onClick={() => handleCardClick("Atlantic Avenue", "$260", "/yellow_card.png")} />
          </div>

          {/* Bottom row - 5 cards */}
          <div className="grid place-items-center">
            <Card name="Vermont Avenue" icon="/yellow_card.png" amount="$100" position={4} players={playerPositions} onClick={() => handleCardClick("Vermont Avenue", "$100", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Oriental Avenue" icon="/yellow_card.png" amount="$100" position={3} players={playerPositions} onClick={() => handleCardClick("Oriental Avenue", "$100", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Baltic Avenue" icon="/yellow_card.png" amount="$60" position={2} players={playerPositions} onClick={() => handleCardClick("Baltic Avenue", "$60", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Mediterranean Ave" icon="/yellow_card.png" amount="$60" position={1} players={playerPositions} onClick={() => handleCardClick("Mediterranean Ave", "$60", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="GO" icon="/yellow_card.png" amount="$200" position={0} players={playerPositions} onClick={() => handleCardClick("GO", "$200", "/yellow_card.png")} />
          </div>
        </div>

        <CardModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          cardName={selectedCard?.name}
          cardAmount={selectedCard?.amount}
          cardIcon={selectedCard?.icon}
          onBuy={buyProperty}
          onPass={passProperty}
        />
      </div>
  )
}

export default Board
