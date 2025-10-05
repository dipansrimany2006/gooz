'use client'
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

import { useState, useCallback, useEffect } from 'react';

function HomePage() {
  // TODO: Replace with Thirdweb wallet connection
  const accountId = null;
  const isConnected = false;
  const playerName = 'player'; // Constant player name
  const [roomId, setRoomId] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string;
  
  const client = createThirdwebClient({ clientId });
  // Load previously stored gameId on component mount
  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId');
    if (storedGameId) {
      setRoomId(storedGameId);
    }
  }, []);


  const handleCreateRoom = useCallback(async () => {
    if (!isConnected || !playerName.trim()) return;

    setIsCreatingRoom(true);
    // TODO: Replace with API call to create room
    console.log('Create room clicked');
    setIsCreatingRoom(false);
  }, [isConnected, playerName]);

  const handleJoinRoom = useCallback(async () => {
    if (!isConnected || !playerName.trim() || !roomId.trim()) return;

    setIsJoiningRoom(true);
    // TODO: Replace with API call to join room
    console.log('Join room clicked with roomId:', roomId);
    setIsJoiningRoom(false);
  }, [isConnected, playerName, roomId]);

  const isButtonsDisabled = !isConnected;

  return (
    <div className='w-full h-screen bg-[url(/Gooz_bg.png)] flex flex-col items-center justify-center relative'>
      {/* Header */}
      <div className='absolute top-0 left-0 right-0 flex items-center justify-between px-20 py-6'>
        <img src={"/GoozDotFun.png"} alt='Gooz.Fun Logo'/>
        <ConnectButton client={client}/>
      </div>

      {/* Main Content */}
      <div className='flex flex-col items-center justify-center space-y-8'>
        <img src={'/Copy of Gooz.gif'} alt='Game Banner' className='h-150 w-full'/>

        <div className='space-y-8'>
          {/* Create New Room Button */}
          <div
            className={`bg-[url(/createNewRoom.png)] bg-contain bg-no-repeat bg-center w-[700px] h-[80px] cursor-pointer transition-transform hover:scale-105 ${isButtonsDisabled || isCreatingRoom ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={isButtonsDisabled || isCreatingRoom ? undefined : handleCreateRoom}
          />

          {/* Join Room Section */}
          <div className='space-y-4 flex w-full justify-between'>
            {/* Room ID Input with textarea background */}
            <div className='relative'>
              <div className='bg-[url(/textarea.png)] bg-contain bg-no-repeat bg-center w-[400px] h-[60px] relative'>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="Enter room ID"
                  className='absolute inset-0 bg-transparent text-black font-medium text-center border-none outline-none px-4 py-2'
                  maxLength={8}
                />
              </div>
            </div>
            {/* Join Room Button */}
            <div
              className={`bg-[url(/join_img.png)] bg-contain bg-no-repeat bg-center w-[200px] h-[60px] cursor-pointer transition-transform hover:scale-105 ${isButtonsDisabled || isJoiningRoom || !roomId.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={isButtonsDisabled || isJoiningRoom || !roomId.trim() ? undefined : handleJoinRoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomePage />;
}
