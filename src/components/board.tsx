'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Card from './card'
import CardModal from './cardmodal'
import JailModal from './JailModal'
import SellPropertiesModal from './SellPropertiesModal'
import RentPaymentModal from './RentPaymentModal'
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
  index: number;
}

const Board = () => {
  // Use shared game context
  const {
    gameId,
    currentPlayer,
    playerPositions, setPlayerPositions,
    serverPlayers,
    diceRoll,
    walletAddress,
    sendMessage,
    wsConnected,
    pendingAction,
    pendingBlock,
    setPendingBlock,
    inJail,
    insufficientFunds,
    setInsufficientFunds,
    rentPayment,
    setRentPayment,
  } = useGame();

  const accountId = walletAddress;

  // Position mapping: Server (20 positions) → Frontend (15 positions)
  // Wrapped in useCallback to prevent infinite loop in useEffect
  const mapServerToFrontend = useCallback((serverPosition: number): number => {
    return POSITION_MAPPING[serverPosition as keyof typeof POSITION_MAPPING] ?? serverPosition % 15;
  }, []); // Empty deps - POSITION_MAPPING is a constant

  const rollDice = () => {
    console.log('🎲 DICE ROLL DEBUG:');
    console.log('- Game ID:', gameId);
    console.log('- Current Player:', currentPlayer);
    console.log('- Player ID (accountId):', accountId);
    console.log('- Is my turn?:', currentPlayer === accountId);

    if (gameId && currentPlayer === accountId && accountId && wsConnected) {

      const success = sendMessage({
        type: 'ROLL_DICE',
        gameId: gameId,
        playerId: accountId,
      });

      if (success) {
        console.log('✅ ROLL_DICE message sent');
      } else {
        console.error('❌ Failed to send ROLL_DICE message');
      }
    } else {
      console.log('❌ Cannot roll dice:');
      console.log('  - Game ID:', gameId ? gameId : 'Missing');
      console.log('  - Account ID:', accountId ? accountId : 'Not connected');
      console.log('  - WebSocket:', wsConnected ? 'Connected' : 'Disconnected');
      console.log('  - Turn check:', currentPlayer === accountId ? 'My turn' : 'Not my turn');
    }
  };

  // Manual join game function for testing
  const joinGame = () => {
    if (gameId && accountId) {
      // TODO: Replace with API call to join game
      console.log('Join game clicked');
    } else {
      console.log('Cannot join - no game ID or wallet not connected');
    }
  };

  // Buy property function
  const buyProperty = () => {
    if (gameId && accountId && wsConnected) {
      const success = sendMessage({
        type: 'BUY_PROPERTY',
        gameId: gameId,
        playerId: accountId,
      });

      if (success) {
        console.log('✅ BUY_PROPERTY message sent');
      } else {
        console.error('❌ Failed to send BUY_PROPERTY message');
      }
    } else {
      console.log('❌ Cannot buy property: missing gameId, accountId, or WebSocket connection');
    }
  };

  // Pass property function
  const passProperty = () => {
    if (gameId && accountId && wsConnected) {
      const success = sendMessage({
        type: 'PASS_PROPERTY',
        gameId: gameId,
        playerId: accountId,
      });

      if (success) {
        console.log('✅ PASS_PROPERTY message sent');
      } else {
        console.error('❌ Failed to send PASS_PROPERTY message');
      }
    } else {
      console.log('❌ Cannot pass property: missing gameId, accountId, or WebSocket connection');
    }
  };

  // Sell property function
  const sellProperty = (blockName: string) => {
    if (gameId && accountId && wsConnected) {
      const success = sendMessage({
        type: 'SELL_PROPERTY',
        gameId: gameId,
        playerId: accountId,
        blockName: blockName,
      });

      if (success) {
        console.log('✅ SELL_PROPERTY message sent for:', blockName);
      } else {
        console.error('❌ Failed to send SELL_PROPERTY message');
      }
    } else {
      console.log('❌ Cannot sell property: missing gameId, accountId, or WebSocket connection');
    }
  };

  // Jail choice handlers
  const handleJailPay = () => {
    if (gameId && accountId && wsConnected) {
      const success = sendMessage({
        type: 'JAIL_CHOICE',
        gameId: gameId,
        playerId: accountId,
        jailChoice: 'pay',
      });

      if (success) {
        console.log('✅ JAIL_CHOICE (pay) message sent');
      } else {
        console.error('❌ Failed to send JAIL_CHOICE message');
      }
    }
  };

  const handleJailRoll = () => {
    if (gameId && accountId && wsConnected) {
      const success = sendMessage({
        type: 'JAIL_CHOICE',
        gameId: gameId,
        playerId: accountId,
        jailChoice: 'roll',
      });

      if (success) {
        console.log('✅ JAIL_CHOICE (roll) message sent');
      } else {
        console.error('❌ Failed to send JAIL_CHOICE message');
      }
    }
  };

  // TODO: Replace with API polling or other state management
  // Remove websocket message handler

  // Local state for modal
  const [selectedCard, setSelectedCard] = useState<{ name: string; amount: string; icon: string } | null>(null);

  // Show modal when server requests buy/pass decision
  const isModalOpen = pendingAction === 'BUY_OR_PASS';


  // Initialize demo players at GO (logical position 0, visual position 11)
  // TODO: Set up API polling or other state management

  // Update player positions when serverPlayers change
  useEffect(() => {
    if (serverPlayers && serverPlayers.length > 0) {
      const positions: PlayerPosition[] = serverPlayers.map((player, index) => ({
        playerId: player.id,
        name: player.name,
        colorCode: player.colorCode,
        currentPosition: mapServerToFrontend(player.position),
        index: index + 1
      }));
      setPlayerPositions(positions);
    }
  }, [serverPlayers, mapServerToFrontend]);

  const updatePlayerPosition = (playerId: string, newPosition: number) => {
    setPlayerPositions((prev: PlayerPosition[]) => prev.map((player: PlayerPosition) =>
      player.playerId === playerId
        ? { ...player, currentPosition: newPosition, targetPosition: newPosition }
        : player
    ));
  };

  const updateAllPlayerPositions = (players: Player[]) => {
    const positions: PlayerPosition[] = players.map((player, index) => ({
      playerId: player.id,
      name: player.name,
      colorCode: player.colorCode,
      currentPosition: mapServerToFrontend(player.position),
      index: index + 1
    }));
    setPlayerPositions(positions);
  };

  const handleCardClick = (name: string, amount: string, icon: string) => {
    setSelectedCard({ name, amount, icon });
  };

  const handleCloseModal = () => {
    // User closed modal without buying/passing - send PASS message
    if (pendingAction === 'BUY_OR_PASS') {
      passProperty();
    }
    setSelectedCard(null);
    setPendingBlock(null);
  };


  return (
    <div className="bg-[url('/white-bg.png')] bg-contain bg-center bg-no-repeat w-[1000px] h-[800px] relative flex items-center justify-center col-span-4">
      {/* Connection Status */}
      <div className="absolute hidden top-4 right-4 z-20">
        <div className="px-3 py-1 rounded text-sm font-bold bg-blue-500 text-white">
          Game: {gameId || 'Not in game'}
        </div>
        {currentPlayer && (
          <div className="px-3 py-1 bg-blue-500 text-white rounded text-xs mt-1">
            Current: {currentPlayer === accountId ? 'YOUR TURN' : 'Waiting'}
          </div>
        )}
        {/* Join Game Button for Testing */}
        <Button
          onClick={joinGame}
          className="mt-2 px-3 py-1 bg-purple-500 text-white text-xs rounded"
        >
          JOIN GAME
        </Button>
      </div>
        <div className="grid grid-cols-5 grid-rows-4 gap-4 w-full h-full py-16 px-4">
          {/* Top row - 5 cards */}
          <div className="grid place-items-center">
            <Card name="Jail" icon="/yellow_card.png" amount="-$200" position={7} isCorner={true} players={playerPositions} onClick={() => handleCardClick("Jail", "-$200", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Silicon Square" icon="/images/solicon_square.png" amount="$220" position={8} players={playerPositions} onClick={() => handleCardClick("Silicon Square", "$220", "/images/solicon_square.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Streamline Tower" icon="/images/streamline_tower.png" amount="$240" position={9} players={playerPositions} onClick={() => handleCardClick("Streamline Tower", "$240", "/images/streamline_tower.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Neon Heights" icon="/images/neon_heights.png" amount="$260" position={10} players={playerPositions} onClick={() => handleCardClick("Neon Heights", "$260", "/images/neon_heights.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Party House" icon="/yellow_card.png" amount="-$50" position={11} isCorner={true} players={playerPositions} onClick={() => handleCardClick("Party House", "-$50", "/yellow_card.png")} />
          </div>

          {/* Second row - only first and last positions */}
          <div className="grid place-items-center">
            <Card name="Byte Boulevard" icon="/images/byte_bolvard.jpeg" amount="$200" position={6} players={playerPositions} onClick={() => handleCardClick("Byte Boulevard", "$200", "/images/byte_bolvard.jpeg")} />
          </div>
          <div className="grid place-items-center col-span-3 row-span-2 rounded-lg">
              <Button onClick={rollDice} className='relative h-[250px] w-[250px]' disabled={currentPlayer !== accountId}>
                <img src={"/Group 1.png"} alt='' height={250} width={250} className=''/>
                <div className="absolute bottom-1/2 translate-y-full left-3 text-xl font-bold w-24 h-16 flex items-center justify-center">
                  <img src="/brustBubble_gooz 1.png" alt="" height={120} width={96} className="absolute inset-0 object-contain" />
                  <span className="relative rotate-[-25deg] z-10 top-4 -left-2 text-black">
                    {currentPlayer !== accountId ? "Wait Turn" :
                      diceRoll !== null ? `🎲 ${diceRoll}` : "Roll Me"}
                  </span>
                </div>
              </Button>
          </div>
          <div className="grid place-items-center">
            <Card name="Metro Mile" icon="/images/metro_mile.jpeg" amount="$280" position={12} players={playerPositions} onClick={() => handleCardClick("Metro Mile", "$280", "/images/metro_mile.jpeg")} />
          </div>

          {/* Third row - only first and last positions */}
          <div className="grid place-items-center">
            <Card name="Venture Valley" icon="/images/venture_valley.png" amount="$180" position={5} players={playerPositions} onClick={() => handleCardClick("Venture Valley", "$180", "/images/venture_valley.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Crypto Corner" icon="/images/crypto_corner.jpeg" amount="$300" position={13} players={playerPositions} onClick={() => handleCardClick("Crypto Corner", "$300", "/images/crypto_corner.jpeg")} />
          </div>

          {/* Bottom row - 5 cards */}
          <div className="grid place-items-center">
            <Card name="Rest House" icon="/yellow_card.png" amount="$50" position={4} isCorner={true} players={playerPositions} onClick={() => handleCardClick("Rest House", "$50", "/yellow_card.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Cloud Street" icon="/images/cloud_street.jpeg" amount="$150" position={3} players={playerPositions} onClick={() => handleCardClick("Cloud Street", "$150", "/images/cloud_street.jpeg")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Pixel Plaza" icon="/images/pixel_plaza.png" amount="$120" position={2} players={playerPositions} onClick={() => handleCardClick("Pixel Plaza", "$120", "/images/pixel_plaza.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="Startup Street" icon="/images/startup_street.png" amount="$100" position={1} players={playerPositions} onClick={() => handleCardClick("Startup Street", "$100", "/images/startup_street.png")} />
          </div>
          <div className="grid place-items-center">
            <Card name="GO" icon="/yellow_card.png" amount="$70" position={0} isCorner={true} players={playerPositions} onClick={() => handleCardClick("GO", "$70", "/yellow_card.png")} />
          </div>
        </div>

        <CardModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          cardName={pendingBlock?.name || selectedCard?.name}
          cardAmount={pendingBlock?.price ? `$${pendingBlock.price}` : selectedCard?.amount}
          cardIcon={selectedCard?.icon}
          cardDescription={pendingBlock?.description}
          cardRent={pendingBlock?.rent}
          cardImage={pendingBlock?.imageURL}
          onBuy={buyProperty}
          onPass={passProperty}
        />

        {/* Jail Choice Modal */}
        <JailModal
          isOpen={inJail && pendingAction === 'JAIL_CHOICE'}
          onPay={handleJailPay}
          onRoll={handleJailRoll}
          onClose={() => {}}
        />

        {/* Sell Properties Modal (when insufficient funds) */}
        <SellPropertiesModal
          isOpen={!!insufficientFunds}
          rentAmount={insufficientFunds?.rentAmount || 0}
          currentMoney={insufficientFunds?.currentMoney || 0}
          ownedProperties={insufficientFunds?.ownedProperties || []}
          onSellProperty={sellProperty}
          onClose={() => setInsufficientFunds(null)}
        />

        {/* Rent Payment Modal */}
        <RentPaymentModal
          isOpen={!!rentPayment}
          ownerName={rentPayment?.ownerName || ''}
          amount={rentPayment?.amount || 0}
          propertyName={rentPayment?.propertyName || ''}
          onClose={() => setRentPayment(null)}
        />
      </div>
  )
}

export default Board
