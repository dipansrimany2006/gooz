'use client'
import { Button } from '@/components/ui/button';
import Card from '../components/card';
import { useState } from 'react';
import Sidepanel from '@/components/sidepanel';
import Board from '@/components/board';

export default function Home() {

  return (
    <div className="h-screen w-screen p-0 m-0 bg-[url('/Gooz_bg.png')] bg-cover bg-center bg-no-repeat grid grid-cols-5">
      <Sidepanel/>
      <div className='grid place-items-center'>
        <Board />
      </div>
    </div>
  );
}
