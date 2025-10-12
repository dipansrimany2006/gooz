'use client'
import Sidepanel from '@/components/sidepanel';
import Board from '@/components/board';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import ChatRoom from '@/components/chatRoom';
import { useGame } from '@/context/GameContext';

function PlayPage() {
  const { gameId } = useGame();

  return (
    <div className="h-screen w-screen p-0 m-0 bg-[url('/Gooz_bg.png')] bg-cover bg-center bg-no-repeat">
        <div className='flex items-end justify-between px-20 h-20'>
          <img src={"/GoozDotFun.png"} alt=''/>
          <ConnectWalletButton/>
        </div>
      <div className="flex items-center justify-evenly h-[calc(100vh-120px)]">
        <Sidepanel roomid={gameId || ''} />
        <div className='grid place-items-center'>
          <Board />
        </div>
        <ChatRoom />
      </div>
    </div>
  );
}

export default function Home() {
  return <PlayPage />;
}
