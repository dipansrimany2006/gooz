import React from 'react'
import Player from './player'
import { useGame } from '../context/GameContext'

const Sidepanel = ({roomid}: {roomid: string}) => {
  const { serverPlayers, currentPlayer, gameId, isConnected, walletAddress, creatorId, sendMessage, wsConnected } = useGame();

  // Define color mapping for players
  const playerColors = ['#5BC0EB', '#9B7DD2', '#F38375', '#2DD881'];

  // Mock wallet addresses for demo (in real app, these would come from server/blockchain)
  const mockWallets = [
    "HUcK1cHAYhKfqi6izsftntWhbSr6jP8KNhSZUFRVRt6d",
    "HfBbURZf7Bn3Y4HSRCJBf1qhBTrPYTgtwHgeXZmDbj42",
    "DQAi6engSi6u4qcEpdpM1ttCrkWgiehpieKKj3s4p452",
    "9aCkmVoW86yFaZNdstUymjvsLTfZeKUXGMUrSdjgh8A3"
  ];

  const isCreator = walletAddress === creatorId;
  const canStartGame = isCreator && serverPlayers.length >= 2 && !currentPlayer;

  const handleStartGame = () => {
    if (!gameId || !walletAddress || !wsConnected) {
      console.warn('Cannot start game: missing requirements');
      return;
    }

    const success = sendMessage({
      type: 'START_GAME',
      gameId: gameId,
      playerId: walletAddress,
    });

    if (success) {
      console.log('✅ START_GAME message sent');
    } else {
      console.error('❌ Failed to send START_GAME message');
    }
  };

  return (
    <div className=''>
      <div className='bg-[#D9D9D9] h-[700px] w-[300px] border-4 rounded-4xl border-black'>
        {/* Title */}
        <div className='p-6'>
          <h2 className='text-xl font-bold'>Room ID: {gameId || roomid}</h2>
          <div className='flex items-center gap-2 mt-2'>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className='text-sm'>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        {/* Players List */}
        <div className='grid place-items-center mt-4'>
          {serverPlayers.length > 0 ? (
            serverPlayers.map((player, index) => (
              <Player
                key={player.id}
                playerId={player.id}
                playerName={player.name}
                walletAddress={mockWallets[index] || undefined}
                backgroundColor={player.colorCode || playerColors[index]}
                poolAmt={player.poolAmt}
                position={index + 1}
                isCurrentPlayer={currentPlayer === player.id && player.id === walletAddress}
                ownedBlocks={player.ownedBlocks || []}
              />
            ))
          ) : (
            <div className='text-gray-600 text-center p-4'>
              {isConnected ? 'Waiting for players...' : 'Connecting to game...'}
            </div>
          )}

          {/* Show current player info if available */}
          {currentPlayer && (
            <div className='text-center mt-4 p-2 bg-yellow-100 rounded'>
              <div className='text-sm font-bold'>Current Player</div>
              <div className='text-xs'>
                {currentPlayer === walletAddress ? 'Your Turn!' : 'Waiting...'}
              </div>
            </div>
          )}
        </div>

        {/* Game Stats and Start Button */}
        <div className='absolute bottom-4 left-4 right-4 space-y-2'>
          {/* Start Game Button (only for creator before game starts) */}
          {canStartGame && (
            <button
              onClick={handleStartGame}
              className='w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors'
            >
              START GAME ({serverPlayers.length} Players)
            </button>
          )}

          {/* Waiting message for non-creators */}
          {!currentPlayer && !isCreator && serverPlayers.length >= 2 && (
            <div className='bg-yellow-100 rounded p-2'>
              <div className='text-xs text-center font-bold'>
                Waiting for creator to start...
              </div>
            </div>
          )}

          <div className='bg-white/50 rounded p-2'>
            <div className='text-xs text-center'>
              Players: {serverPlayers.length}/4
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidepanel
