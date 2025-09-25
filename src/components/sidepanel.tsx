import React from 'react'
import Player from './player'

const Sidepanel = ({roomid}: {roomid: string}) => {
  return (
    <div className=''>
      <div className='bg-[#D9D9D9] h-[700px] w-[300px] border-4 rounded-4xl border-black'>
        {/* Title */}
        {/* Room No */}
        <h2 className='text-xl font-bold p-6'>Room ID: {roomid}</h2>
        <div className='grid place-items-center mt-10'>
          <Player walletAddress="HUcK1cHAYhKfqi6izsftntWhbSr6jP8KNhSZUFRVRt6d" backgroundColor="#1ABCFE" playerNumber={1} />
          <Player walletAddress="HfBbURZf7Bn3Y4HSRCJBf1qhBTrPYTgtwHgeXZmDbj42" backgroundColor="#A259FF" playerNumber={2} />
          <Player walletAddress='DQAi6engSi6u4qcEpdpM1ttCrkWgiehpieKKj3s4p452' backgroundColor="#0ACF83" playerNumber={3} />
          <Player walletAddress='9aCkmVoW86yFaZNdstUymjvsLTfZeKUXGMUrSdjgh8A3' backgroundColor="#FF7262" playerNumber={4} />
        </div>
      </div>
    </div>
  )
}

export default Sidepanel
