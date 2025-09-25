'use client'
import React, { useState, useEffect } from 'react'
import Card from './card'
import { Button } from './ui/button'

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
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);

  const randomSpeaker = () => {
    console.log(1);
    const roll = Math.floor(Math.random() * 6) + 1; // generates 1–6
    setDiceRoll(roll);

    // Simulate player movement when dice is rolled
    if (currentPlayer && playerPositions.length > 0) {
      simulatePlayerMovement(currentPlayer, roll);
    }
  }

  // Initialize demo players at GO (logical position 0, visual position 11)
  useEffect(() => {
    const demoPlayers: PlayerPosition[] = [
      { playerId: '1', name: 'Player 1', colorCode: '#FF0000', currentPosition: 7 }, // GO position
      { playerId: '2', name: 'Player 2', colorCode: '#00FF00', currentPosition: 10 }, // GO position
      { playerId: '3', name: 'Player 3', colorCode: '#0000FF', currentPosition: 0 }, // GO position
    ];
    setPlayerPositions(demoPlayers);
    setCurrentPlayer('1');
  }, []);

  const simulatePlayerMovement = (playerId: string, roll: number) => {
    setPlayerPositions(prev => prev.map(player => {
      if (player.playerId === playerId) {
        const newLogicalPosition = (player.currentPosition + roll) % 15; // 15 total board positions (0-14)
        return {
          ...player,
          currentPosition: newLogicalPosition,
          targetPosition: newLogicalPosition
        };
      }
      return player;
    }));
  };

  // WebSocket integration functions (ready for server connection)

  const updatePlayerPosition = (playerId: string, newPosition: number) => {
    setPlayerPositions(prev => prev.map(player =>
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
      currentPosition: player.position
    }));
    setPlayerPositions(positions);
  };

  return (
    <div className="bg-[url('/white-bg.png')] bg-contain bg-center bg-no-repeat w-[1000px] h-[800px] relative flex items-center justify-center col-span-4">
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
              <Button onClick={randomSpeaker} className='relative h-[250px] w-[250px]'>
                <img src={"/Group 1.png"} alt='' height={250} width={250} className=''/>
                <div className="absolute bottom-1/2 translate-y-full left-3 text-xl font-bold w-24 h-16 flex items-center justify-center">
                  <img src="/brustBubble_gooz 1.png" alt="" height={120} width={96} className="absolute inset-0 object-contain" />
                  <span className="relative rotate-[-25deg] z-10 top-4 -left-2 text-black">
                    {diceRoll !== null ? `🎲 ${diceRoll}` : "Roll Me"}
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
