'use client'
import React, { useState, useEffect } from 'react'
import Card from './card'
import { Button } from './ui/button'
import { GAME_CONFIG, POSITION_MAPPING } from '../config/gameConfig'
import { useGame } from '../context/GameContext'

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

  // Initialize gameId from config if not set
  useEffect(() => {
    if (!gameId) {
      setGameId(GAME_CONFIG.GAME_ID);
    }
  }, [gameId, setGameId]);

  // Game settings from config
  const { PLAYER_ID, PLAYER_NAME, PLAYER_COLOR, WS_URL, AUTO_CREATE_GAME, AUTO_JOIN_EXISTING } = GAME_CONFIG;

  // Position mapping: Server (20 positions) → Frontend (15 positions)
  const mapServerToFrontend = (serverPosition: number): number => {
    return POSITION_MAPPING[serverPosition as keyof typeof POSITION_MAPPING] ?? serverPosition % 15;
  };

  const rollDice = () => {
    if (ws && gameId && currentPlayer === PLAYER_ID) {
      const message = {
        type: 'ROLL_DICE',
        gameId: gameId,
        playerId: PLAYER_ID
      };
      ws.send(JSON.stringify(message));
      console.log('Sent dice roll request:', message);
    } else {
      console.log('Cannot roll dice - not connected or not your turn');
    }
  };

  // Manual join game function for testing
  const joinGame = () => {
    if (ws && gameId) {
      const joinGameMessage = {
        type: 'JOIN_GAME',
        gameId: gameId,
        playerId: PLAYER_ID,
        playerName: PLAYER_NAME,
        colorCode: PLAYER_COLOR
      };
      ws.send(JSON.stringify(joinGameMessage));
      console.log('Manual join game request sent:', joinGameMessage);
    } else {
      console.log('Cannot join - WebSocket not connected or no game ID');
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
          console.log('Dice rolled:', message.diceRoll, 'New position:', message.newPosition);
          setDiceRoll(message.diceRoll);
          const frontendPosition = mapServerToFrontend(message.newPosition);
          updatePlayerPosition(message.playerId, frontendPosition);
          break;

        case 'NEXT_TURN':
          console.log('Next turn:', message.currentPlayer?.name);
          setCurrentPlayer(message.currentPlayer?.id || null);
          updateAllPlayerPositions(message.players);
          setServerPlayers(message.players); // Update server players
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

  // WebSocket connection setup
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const websocket = new WebSocket(WS_URL);

        websocket.onopen = () => {
          if (GAME_CONFIG.ENABLE_CONSOLE_LOGS) {
            console.log('WebSocket connected');
          }
          setIsConnected(true);
          setWs(websocket);

          // Join existing game or create new one based on config
          if (AUTO_JOIN_EXISTING && gameId) {
            const joinGameMessage = {
              type: 'JOIN_GAME',
              gameId: gameId,
              playerId: PLAYER_ID,
              playerName: PLAYER_NAME,
              colorCode: PLAYER_COLOR
            };
            websocket.send(JSON.stringify(joinGameMessage));
            if (GAME_CONFIG.ENABLE_CONSOLE_LOGS) {
              console.log('Sent join game message:', joinGameMessage);
            }
          } else if (AUTO_CREATE_GAME) {
            const createGameMessage = {
              type: 'CREATE_GAME',
              playerId: PLAYER_ID,
              playerName: PLAYER_NAME,
              colorCode: PLAYER_COLOR
            };
            websocket.send(JSON.stringify(createGameMessage));
            if (GAME_CONFIG.ENABLE_CONSOLE_LOGS) {
              console.log('Sent create game message:', createGameMessage);
            }
          }
        };

        websocket.onmessage = handleWebSocketMessage;

        websocket.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          setWs(null);
          setGameId(null);
        };

        websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

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

  return (
    <div className="bg-[url('/white-bg.png')] bg-contain bg-center bg-no-repeat w-[1000px] h-[800px] relative flex items-center justify-center col-span-4">
      {/* Connection Status */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`px-3 py-1 rounded text-sm font-bold ${
          isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {isConnected ? `Connected (${gameId})` : 'Disconnected'}
        </div>
        {currentPlayer && (
          <div className="px-3 py-1 bg-blue-500 text-white rounded text-xs mt-1">
            Current: {currentPlayer === PLAYER_ID ? 'YOUR TURN' : 'Waiting'}
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
            <Card name="Jail" icon="/yellow_card.png" amount="$200" position={7} players={playerPositions} />
          </div>
          <div className="grid place-items-center">
            <Card name="Property 8" icon="/yellow_card.png" amount="$100" position={8} players={playerPositions} />
          </div>
          <div className="grid place-items-center">
            <Card name="Property 9" icon="/yellow_card.png" amount="$150" position={9} players={playerPositions} />
          </div>
          <div className="grid place-items-center">
            <Card name="Property 10" icon="/yellow_card.png" amount="$200" position={10} players={playerPositions} />
          </div>
          <div className="grid place-items-center">
            <Card name="Free Parking" icon="/yellow_card.png" amount="-$100" position={11} players={playerPositions} />
          </div>

          {/* Second row - only first and last positions */}
          <div className="grid place-items-center">
            <Card name="Property 6" icon="/yellow_card.png" amount="$450" position={6} players={playerPositions} />
          </div>
          <div className="grid place-items-center col-span-3 row-span-2 rounded-lg">
              <Button onClick={rollDice} className='relative h-[250px] w-[250px]' disabled={!isConnected || currentPlayer !== PLAYER_ID}>
                <img src={"/Group 1.png"} alt='' height={250} width={250} className=''/>
                <div className="absolute bottom-1/2 translate-y-full left-3 text-xl font-bold w-24 h-16 flex items-center justify-center">
                  <img src="/brustBubble_gooz 1.png" alt="" height={120} width={96} className="absolute inset-0 object-contain" />
                  <span className="relative rotate-[-25deg] z-10 top-4 -left-2 text-black">
                    {!isConnected ? "Connecting..." :
                      currentPlayer !== PLAYER_ID ? "Wait Turn" :
                      diceRoll !== null ? `🎲 ${diceRoll}` : "Roll Me"}
                  </span>
                </div>
              </Button>
          </div>
          <div className="grid place-items-center">
            <Card name="Property 12" icon="/yellow_card.png" amount="$250" position={12} players={playerPositions} />
          </div>

          {/* Third row - only first and last positions */}
          <div className="grid place-items-center">
            <Card name="Property 5" icon="/yellow_card.png" amount="$425" position={5} players={playerPositions} />
          </div>
          <div className="grid place-items-center">
            <Card name="Property 13" icon="/yellow_card.png" amount="$275" position={13} players={playerPositions} />
          </div>

          {/* Bottom row - 5 cards */}
          <div className="grid place-items-center">
            <Card name="Property 4" icon="/yellow_card.png" amount="$0" position={4} players={playerPositions} />
          </div>
          <div className="grid place-items-center">
            <Card name="Property 3" icon="/yellow_card.png" amount="$325" position={3} players={playerPositions} />
          </div>
          <div className="grid place-items-center">
            <Card name="Property 2" icon="/yellow_card.png" amount="$350" position={2} players={playerPositions} />
          </div>
          <div className="grid place-items-center">
            <Card name="Property 1" icon="/yellow_card.png" amount="$375" position={1} players={playerPositions} />
          </div>
          <div className="grid place-items-center">
            <Card name="GO" icon="/yellow_card.png" amount="$200" position={0} players={playerPositions} />
          </div>
        </div>
      </div>
  )
}

export default Board
