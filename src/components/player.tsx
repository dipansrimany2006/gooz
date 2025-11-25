import React, { useState } from 'react'

interface PlayerProps {
  playerId: string;
  playerName: string;
  walletAddress?: string;
  backgroundColor: string;
  poolAmt: number;
  position: number;
  isCurrentPlayer?: boolean;
  ownedBlocks?: string[];
}

const Player = ({
  playerId,
  playerName,
  walletAddress,
  backgroundColor,
  poolAmt,
  position,
  isCurrentPlayer = false,
  ownedBlocks = []
}: PlayerProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

      {/* Properties Dropdown */}
      <div className='mt-2'>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className='w-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded flex items-center justify-between transition-colors'
        >
          <span>Properties ({ownedBlocks.length})</span>
          <span className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isDropdownOpen && (
          <div className='mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto'>
            {ownedBlocks.length === 0 ? (
              <div className='px-3 py-2 text-xs text-gray-500 text-center'>
                No properties owned
              </div>
            ) : (
              <ul className='divide-y divide-gray-200'>
                {ownedBlocks.map((blockName, index) => (
                  <li key={index} className='px-3 py-2 hover:bg-gray-50 transition-colors'>
                    <div className='text-xs font-semibold text-gray-800'>{blockName}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Player
