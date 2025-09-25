import React from 'react'

interface PlayerProps {
  walletAddress: string;
  backgroundColor: string;
  playerNumber: number;
}

const Player = ({ walletAddress, backgroundColor, playerNumber }: PlayerProps) => {
  const trimmedAddress = `${walletAddress.slice(0, 14)}...${walletAddress.slice(-4)}`;

  return (
    <div style={{ backgroundColor }} className='w-[250px] h-[50px] rounded-2xl mb-4 flex items-center justify-center border-4 border-black'>
      <div className='flex items-center'>
        <span className='font-bold text-sm p-2'>Player {playerNumber}</span>
        <span className='text-xs'>{trimmedAddress}</span>
      </div>
    </div>
  )
}

export default Player
