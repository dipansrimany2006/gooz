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
  const trimmedAddress = walletAddress
    ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}`
    : 'No Wallet';

  return (
    <div
      style={{ backgroundColor }}
      className={`
        w-[250px] rounded-2xl mb-4 flex items-center justify-center border-4 border-black
        transition-all duration-300 p-3
        ${isCurrentPlayer
          ? 'h-[70px] shadow-lg border-yellow-400 scale-105'
          : 'h-[55px] shadow-sm'
        }
      `}
    >
      <div className='flex items-center w-full justify-between'>
        <div className='flex items-center'>
          <img src={'/Group 1.png'} alt='' height={30} width={30}/>
          <div className='ml-2'>
            <div className={`font-bold transition-all duration-300 ${
              isCurrentPlayer
                ? 'text-base text-white'
                : 'text-sm text-gray-800'
            }`}>
              {playerName}
            </div>
            <div className='text-xs text-gray-600'>
              ${poolAmt} • Pos: {position}
            </div>
          </div>
        </div>

        {isCurrentPlayer && (
          <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
            YOUR TURN
          </div>
        )}
      </div>

      {walletAddress && (
        <div className='text-xs text-gray-500 mt-1 text-center'>
          {trimmedAddress}
        </div>
      )}
    </div>
  )
}

export default Player
