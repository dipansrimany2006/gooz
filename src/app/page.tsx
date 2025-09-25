'use client'
import ConnectWalletButton from '../components/ConnectWalletButton';
import { useGame } from '@/context/GameContext';
import { useWallet } from '../context/WalletProvider';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function HomePage() {
  const { accountId, isConnected } = useWallet();
  const { ws, setWs, setGameId, setIsConnected } = useGame();
  const playerName = 'player'; // Constant player name
  const [roomId, setRoomId] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const router = useRouter();

  // Load previously stored gameId on component mount
  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId');
    if (storedGameId) {
      setRoomId(storedGameId);
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (ws) return ws;

    const newWs = new WebSocket('ws://localhost:8080');

    newWs.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    newWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      if (message.type === 'GAME_CREATED') {
        const receivedGameId = message.gameId;
        setGameId(receivedGameId);
        setRoomId(receivedGameId); // Store the roomId for future reference
        localStorage.setItem('gameId', receivedGameId); // Persist in localStorage
        router.push('/play');
      } else if (message.type === 'PLAYER_JOINED') {
        const receivedGameId = message.gameId || roomId;
        setGameId(receivedGameId);
        setRoomId(receivedGameId); // Update roomId with server response
        localStorage.setItem('gameId', receivedGameId); // Persist in localStorage
        router.push('/play');
      } else if (message.type === 'ERROR') {
        console.error('Game error:', message.message);
        alert('Error: ' + message.message);
        setIsCreatingRoom(false);
        setIsJoiningRoom(false);
      }
    };

    newWs.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsCreatingRoom(false);
      setIsJoiningRoom(false);
    };

    setWs(newWs);
    return newWs;
  }, [ws, setWs, setIsConnected, setGameId, router, roomId]);

  const handleCreateRoom = useCallback(async () => {
    if (!isConnected || !playerName.trim() || !accountId) return;

    setIsCreatingRoom(true);
    const websocket = connectWebSocket();

    if (websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: 'CREATE_GAME',
        playerId: accountId,
        playerName: playerName.trim(),
        colorCode: '#FF6B6B' // Fixed red color
      }));
    } else {
      websocket.addEventListener('open', () => {
        websocket.send(JSON.stringify({
          type: 'CREATE_GAME',
          playerId: accountId,
          playerName: playerName.trim(),
          colorCode: '#FF6B6B' // Fixed red color
        }));
      });
    }
  }, [isConnected, playerName, accountId, connectWebSocket]);

  const handleJoinRoom = useCallback(async () => {
    if (!isConnected || !playerName.trim() || !roomId.trim() || !accountId) return;

    setIsJoiningRoom(true);
    const websocket = connectWebSocket();

    if (websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: 'JOIN_GAME',
        gameId: roomId.trim(),
        playerId: accountId,
        playerName: playerName.trim(),
        colorCode: '#4ECDC4' // Fixed teal color
      }));
    } else {
      websocket.addEventListener('open', () => {
        websocket.send(JSON.stringify({
          type: 'JOIN_GAME',
          gameId: roomId.trim(),
          playerId: accountId,
          playerName: playerName.trim(),
          colorCode: '#4ECDC4' // Fixed teal color
        }));
      });
    }
  }, [isConnected, playerName, roomId, accountId, connectWebSocket]);

  const isButtonsDisabled = !isConnected;

  return (
    <div className='w-full h-screen bg-[url(/Gooz_bg.png)] flex flex-col items-center justify-center relative'>
      {/* Header */}
      <div className='absolute top-0 left-0 right-0 flex items-center justify-between px-20 py-6'>
        <img src={"/GoozDotFun.png"} alt='Gooz.Fun Logo'/>
        <ConnectWalletButton/>
      </div>

      {/* Main Content */}
      <div className='flex flex-col items-center justify-center space-y-8'>
        <img src={'/Rectangle 26.png'} alt='Game Banner' className=''/>

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
