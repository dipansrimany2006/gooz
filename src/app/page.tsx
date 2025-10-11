'use client'
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";

import { useState, useCallback, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import { useRouter } from 'next/navigation';
// COMMENTED OUT FOR TESTING - Re-enable when ready for blockchain integration
// import { depositToGame, u2uTestnet, getEntryFee } from '@/utils/contract';
import { u2uTestnet, getEntryFee } from '@/utils/contract';
import { ethers } from 'ethers';

function HomePage() {
  const router = useRouter();
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const { setWalletAddress, setIsConnected, sendMessage, wsConnected, gameId: contextGameId } = useGame();

  const accountId = account?.address || null;
  const isConnected = !!account;
  const currentChainId = activeChain?.id || (account as any)?.chain?.id;
  const isCorrectNetwork = currentChainId === u2uTestnet.id;
  const networkName = activeChain?.name || (account as any)?.chain?.name || 'Unknown';

  const [roomId, setRoomId] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [depositStatus, setDepositStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [entryFeeDisplay, setEntryFeeDisplay] = useState<string>('...');

  // Update wallet state in context when account changes
  useEffect(() => {
    setWalletAddress(accountId);
    setIsConnected(isConnected);
  }, [accountId, isConnected, setWalletAddress, setIsConnected]);

  // Debug network detection
  useEffect(() => {
    if (account) {
      console.log('🔍 Network Detection Debug:');
      console.log('  - activeChain object:', activeChain);
      console.log('  - activeChain.id:', activeChain?.id);
      console.log('  - activeChain.name:', activeChain?.name);
      console.log('  - account.chain:', (account as any)?.chain);
      console.log('  - Detected Chain ID:', currentChainId);
      console.log('  - Expected Chain ID (U2U Testnet):', u2uTestnet.id);
      console.log('  - Type comparison:', typeof currentChainId, 'vs', typeof u2uTestnet.id);
      console.log('  - Strict equality:', currentChainId === u2uTestnet.id);
      console.log('  - Loose equality:', currentChainId == u2uTestnet.id);
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
          const feeInU2U = ethers.formatEther(fee);
          setEntryFeeDisplay(feeInU2U);
          console.log('📋 Entry fee fetched:', feeInU2U, 'U2U');
        }
      } catch (error) {
        console.error('Failed to fetch entry fee:', error);
        setEntryFeeDisplay('5'); // Fallback
      }
    };

    fetchEntryFee();
  }, [isCorrectNetwork]);


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
      // Step 1: Deposit to smart contract
      // COMMENTED OUT FOR TESTING - Re-enable when ready for blockchain integration
      // const tempGameId = 'CREATE_' + Date.now();
      // setDepositStatus(`💰 Depositing ${entryFeeDisplay} U2U to contract...`);
      // console.log('🎮 Step 1: Depositing to contract...');
      // const depositResult = await depositToGame(tempGameId, account);
      // if (!depositResult.success) {
      //   throw new Error('Deposit transaction failed');
      // }
      // console.log('✅ Deposit successful:', depositResult.transactionHash);

      setDepositStatus('🎮 Creating game...');

      // Step 2: Send CREATE_GAME message to backend
      const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const success = sendMessage({
        type: 'CREATE_GAME',
        playerId: accountId,
        playerName: accountId.substring(0, 8),
        colorCode: randomColor,
        stakeAmount: entryFeeDisplay,
      });

      if (success) {
        console.log('✅ CREATE_GAME message sent');
        setDepositStatus('✅ Game created! Redirecting...');

        // Wait for game creation response, then navigate
        setTimeout(() => {
          if (contextGameId) {
            router.push('/play');
          }
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
  }, [isConnected, accountId, wsConnected, account, sendMessage, router, contextGameId, entryFeeDisplay]);

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

      // Step 1: Deposit to smart contract
      // COMMENTED OUT FOR TESTING - Re-enable when ready for blockchain integration
      // setDepositStatus(`💰 Depositing ${entryFeeDisplay} U2U to contract...`);
      // console.log('🎮 Step 1: Depositing to join game:', gameId);
      // const depositResult = await depositToGame(gameId, account);
      // if (!depositResult.success) {
      //   throw new Error('Deposit transaction failed');
      // }
      // console.log('✅ Deposit successful:', depositResult.transactionHash);

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
    <div className='w-full h-screen bg-[url(/Gooz_bg.png)] flex flex-col items-center justify-center relative'>
      {/* Header */}
      <div className='absolute top-0 left-0 right-0 flex items-center justify-between px-20 py-6'>
        <img src={"/GoozDotFun.png"} alt='Gooz.Fun Logo'/>
        <div className='flex items-center gap-4'>
          {/* Network Status Indicator */}
          {isConnected && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isCorrectNetwork ? 'bg-green-600/80' : 'bg-red-600/80'}`}>
              <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-200' : 'bg-red-200'}`}></div>
              <span className='text-white text-sm font-medium'>
                {isCorrectNetwork ? '🌐 U2U Testnet' : `⚠️ Wrong Network (${networkName})`}
              </span>
            </div>
          )}
          {/* WebSocket Status Indicator */}
          <div className='flex items-center gap-2 bg-black/50 px-3 py-2 rounded-lg'>
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className='text-white text-sm'>{wsConnected ? 'Server Connected' : 'Connecting...'}</span>
          </div>
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
              <p className='text-center font-medium'>⚠️ Please switch to U2U Nebulas Testnet to play!</p>
            </div>
            {/* Debug info */}
            <div className='bg-gray-800/90 text-white text-xs px-4 py-2 rounded border border-gray-600'>
              <p>Debug: Detected Chain ID: {currentChainId || 'undefined'} | Expected: {u2uTestnet.id} | Match: {String(isCorrectNetwork)}</p>
            </div>
          </div>
        )}

        {/* Debug info when connected to correct network */}
        {isConnected && isCorrectNetwork && (
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
