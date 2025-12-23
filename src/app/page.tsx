'use client'
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";

import { useState, useCallback, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import { useRouter } from 'next/navigation';
import { depositToGame, celoMainnet, getEntryFee } from '@/utils/contract';
import { ethers } from 'ethers';

function HomePage() {
  const router = useRouter();
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const { setWalletAddress, setIsConnected, sendMessage, wsConnected } = useGame();

  const accountId = account?.address || null;
  const isConnected = !!account;
  const currentChainId = activeChain?.id || (account as any)?.chain?.id;
  const isCorrectNetwork = currentChainId === celoMainnet.id;
  const networkName = activeChain?.name || (account as any)?.chain?.name || 'Unknown';

  const [roomId, setRoomId] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [
    depositStatus, setDepositStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [entryFeeDisplay, setEntryFeeDisplay] = useState<string>('...');
  const [showConnectionInfo, setShowConnectionInfo] = useState(false);

  // Update wallet state in context when account changes
  useEffect(() => {
    setWalletAddress(accountId);
    setIsConnected(isConnected);
  }, [accountId, isConnected, setWalletAddress, setIsConnected]);

  // Log WebSocket connection status
  useEffect(() => {
    console.log(`🔌 WebSocket: ${wsConnected ? 'Server Connected' : 'Connecting...'}`);
  }, [wsConnected]);

  // Debug network detection
  useEffect(() => {
    if (account) {
      console.log('🔍 Network Detection Debug:');
      console.log('  - activeChain object:', activeChain);
      console.log('  - activeChain.id:', activeChain?.id);
      console.log('  - activeChain.name:', activeChain?.name);
      console.log('  - account.chain:', (account as any)?.chain);
      console.log('  - Detected Chain ID:', currentChainId);
      console.log('  - Expected Chain ID (Celo Mainnet):', celoMainnet.id);
      console.log('  - Type comparison:', typeof currentChainId, 'vs', typeof celoMainnet.id);
      console.log('  - Strict equality:', currentChainId === celoMainnet.id);
      console.log('  - Loose equality:', currentChainId == celoMainnet.id);
      console.log('  - Is Correct Network:', isCorrectNetwork);
      console.log('  - Network Name:', networkName);
    }
  }, [account, activeChain, currentChainId, isCorrectNetwork, networkName]);
  // Load previously stored gameId on component mount
  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId');
    if (storedGameId) {
      setRoomId(storedGameId);
    }
  }, []);

  // Fetch entry fee from contract
  useEffect(() => {
    const fetchEntryFee = async () => {
      try {
        if (isCorrectNetwork) {
          const fee = await getEntryFee();
          const feeInCELO = ethers.formatEther(fee);
          setEntryFeeDisplay(feeInCELO);
          console.log('📋 Entry fee fetched:', feeInCELO, 'CELO');
        }
      } catch (error) {
        console.error('Failed to fetch entry fee:', error);
        setEntryFeeDisplay('0.01'); // Fallback to 0.01 CELO
      }
    };

    fetchEntryFee();
  }, [isCorrectNetwork]);

  // Auto-dismiss connection info after 5 seconds
  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      setShowConnectionInfo(true);
      const timer = setTimeout(() => {
        setShowConnectionInfo(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowConnectionInfo(false);
    }
  }, [isConnected, isCorrectNetwork]);

  // Auto-dismiss error messages after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleCreateRoom = useCallback(async () => {
    if (!isConnected || !accountId || !wsConnected || !account) {
      console.warn('Cannot create room: wallet or WebSocket not connected');
      setErrorMessage('Please connect your wallet and wait for server connection');
      return;
    }

    setIsCreatingRoom(true);
    setErrorMessage('');
    setDepositStatus('');

    try {
      // Step 1: Generate 8-character game ID (matching backend format)
      const generateGameId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const tempGameId = generateGameId(); // e.g., "A1B2C3D4"
      setDepositStatus(`💰 Depositing ${entryFeeDisplay} CELO to contract...`);
      console.log('🎮 Step 1: Player depositing to contract...');

      const depositResult = await depositToGame(tempGameId, account);
      if (!depositResult.success) {
        throw new Error('Deposit transaction failed');
      }
      console.log('✅ Player deposit successful:', depositResult.transactionHash);
      console.log('📝 GameId used for deposit:', tempGameId);

      // Wait 2 seconds for RPC nodes to sync the transaction state
      setDepositStatus('⏳ Waiting for blockchain confirmation...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      setDepositStatus('🎮 Creating game...');

      // Step 2: Send CREATE_GAME message to backend
      const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      console.log('📤 Sending CREATE_GAME with tempGameId:', tempGameId);

      const success = sendMessage({
        type: 'CREATE_GAME',
        tempGameId: tempGameId,  // Send the gameId we deposited to
        playerId: accountId,
        playerName: accountId.substring(0, 8),
        colorCode: randomColor,
        stakeAmount: entryFeeDisplay,
        transactionHash: depositResult.transactionHash,  // Send tx hash for verification
      });

      if (success) {
        console.log('✅ CREATE_GAME message sent');
        setDepositStatus('✅ Game created! Redirecting...');

        // Store the tempGameId in localStorage so /play page can use it
        localStorage.setItem('gameId', tempGameId);

        // Navigate after a short delay to allow user to see the success message
        setTimeout(() => {
          router.push('/play');
        }, 1500);
      } else {
        throw new Error('Failed to send CREATE_GAME message');
      }
    } catch (error: any) {
      console.error('❌ Error creating game:', error);
      setErrorMessage(error.message || 'Failed to create game. Please try again.');
      setDepositStatus('');
    } finally {
      setTimeout(() => {
        setIsCreatingRoom(false);
      }, 2000);
    }
  }, [isConnected, accountId, wsConnected, account, sendMessage, router, entryFeeDisplay]);

  const handleJoinRoom = useCallback(async () => {
    if (!isConnected || !accountId || !roomId.trim() || !wsConnected || !account) {
      console.warn('Cannot join room: wallet, WebSocket, or room ID missing');
      setErrorMessage('Please connect your wallet and enter a room ID');
      return;
    }

    setIsJoiningRoom(true);
    setErrorMessage('');
    setDepositStatus('');

    try {
      const gameId = roomId.toUpperCase();

      // Step 1: Deposit to smart contract (PLAYER PAYS)
      setDepositStatus(`💰 Depositing ${entryFeeDisplay} CELO to contract...`);
      console.log('🎮 Step 1: Player depositing to join game:', gameId);

      const depositResult = await depositToGame(gameId, account);
      if (!depositResult.success) {
        throw new Error('Deposit transaction failed');
      }
      console.log('✅ Player deposit successful:', depositResult.transactionHash);
      console.log('📝 GameId used for deposit:', gameId);

      // Wait 2 seconds for RPC nodes to sync the transaction state
      setDepositStatus('⏳ Waiting for blockchain confirmation...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      setDepositStatus('🎮 Joining game...');

      // Step 2: Send JOIN_GAME message to backend
      const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const success = sendMessage({
        type: 'JOIN_GAME',
        gameId: gameId,
        playerId: accountId,
        playerName: accountId.substring(0, 8),
        colorCode: randomColor,
        stakeAmount: entryFeeDisplay,
      });

      if (success) {
        console.log('✅ JOIN_GAME message sent for room:', gameId);
        setDepositStatus('✅ Joined game! Redirecting...');

        // Wait for join response, then navigate
        setTimeout(() => {
          router.push('/play');
        }, 1500);
      } else {
        throw new Error('Failed to send JOIN_GAME message');
      }
    } catch (error: any) {
      console.error('❌ Error joining game:', error);
      setErrorMessage(error.message || 'Failed to join game. Please try again.');
      setDepositStatus('');
    } finally {
      setTimeout(() => {
        setIsJoiningRoom(false);
      }, 2000);
    }
  }, [isConnected, accountId, roomId, wsConnected, account, sendMessage, router, entryFeeDisplay]);

  const isButtonsDisabled = !isConnected || !wsConnected || !isCorrectNetwork;

  return (
    <div className='w-full min-h-screen bg-[url(/Gooz_bg.png)] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative'>
      {/* Header */}
      <div className='absolute top-0 left-0 right-0 flex items-center justify-between px-20 py-6'>
        <img src={"/GoozDotFun.png"} alt='Gooz.Fun Logo'/>
        <div className='flex items-center gap-4'>
          <ConnectWalletButton />
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-col items-center justify-center space-y-8'>
        <img src={'/Copy of Gooz.gif'} alt='Game Banner' className='h-150 w-full'/>

        {/* Network Warning */}
        {isConnected && !isCorrectNetwork && (
          <div className='w-[700px] min-h-[60px] flex flex-col items-center justify-center gap-2'>
            <div className='bg-yellow-500/90 text-white px-6 py-3 rounded-lg border-2 border-yellow-600 shadow-lg'>
              <p className='text-center font-medium'>⚠️ Please switch to Celo Mainnet to play!</p>
            </div>
            {/* Debug info */}
            <div className='bg-gray-800/90 text-white text-xs px-4 py-2 rounded border border-gray-600'>
              <p>Debug: Detected Chain ID: {currentChainId || 'undefined'} | Expected: {celoMainnet.id} | Match: {String(isCorrectNetwork)}</p>
            </div>
          </div>
        )}

        {/* Debug info when connected to correct network */}
        {showConnectionInfo && (
          <div className='w-[700px] min-h-[40px] flex items-center justify-center'>
            <div className='bg-gray-800/90 text-white text-xs px-4 py-2 rounded border border-gray-600'>
              <p>✓ Connected: Chain ID {currentChainId} = {networkName}</p>
            </div>
          </div>
        )}

        {/* Status and Error Messages */}
        {(depositStatus || errorMessage) && (
          <div className='w-[700px] min-h-[60px] flex items-center justify-center'>
            {depositStatus && (
              <div className='bg-blue-500/90 text-white px-6 py-3 rounded-lg border-2 border-blue-600 shadow-lg'>
                <p className='text-center font-medium'>{depositStatus}</p>
              </div>
            )}
            {errorMessage && (
              <div className='bg-red-500/90 text-white px-6 py-3 rounded-lg border-2 border-red-600 shadow-lg'>
                <p className='text-center font-medium'>❌ {errorMessage}</p>
              </div>
            )}
          </div>
        )}

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
