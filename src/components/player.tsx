import React from 'react'

interface PlayerProps {
  playerId: string;
  playerName: string;
  walletAddress?: string;
  backgroundColor: string;
  poolAmt: number;
  position: number;
  isCurrentPlayer?: boolean;
}

const Player = ({
  playerId,
  playerName,
  walletAddress,
  backgroundColor,
  poolAmt,
  position,
  isCurrentPlayer = false
}: PlayerProps) => {
  const trimmedId = playerId.length > 12
    ? `${playerId.slice(0, 8)}...${playerId.slice(-4)}`
    : playerId;

  return (
    <div
      style={{ backgroundColor }}
      className={`
        w-[250px] rounded-2xl mb-4 border-4 border-black
        transition-all duration-300 p-3
        ${isCurrentPlayer
          ? 'shadow-lg border-yellow-400 scale-105'
          : 'shadow-sm'
        }
      `}
    >
      <div className='flex items-center w-full justify-between'>
        <div className='flex-1'>
          <div className={`font-bold transition-all duration-300 ${
            isCurrentPlayer
              ? 'text-sm text-white'
              : 'text-xs text-gray-800'
          }`}>
            {trimmedId}
          </div>
          <div className='text-xs text-gray-600 mt-1'>
            Position: {position}
          </div>
        </div>

        <div className='text-right'>
          <div className={`font-bold transition-all duration-300 ${
            isCurrentPlayer
              ? 'text-base text-white'
              : 'text-sm text-gray-800'
          }`}>
            ${poolAmt}
          </div>
        </div>
      </div>

      {isCurrentPlayer && (
        <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold mt-2 text-center">
          YOUR TURN
        </div>
      )}
    </div>
  )
}

export default Player
