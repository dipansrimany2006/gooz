'use client'

import React from 'react';
import ModalTemplate from './ModalTemplate';

interface JailModalProps {
  isOpen: boolean;
  onPay: () => void;
  onRoll: () => void;
  onClose: () => void;
}

const JailModal = ({ isOpen, onPay, onRoll, onClose }: JailModalProps) => {
  const buttons = (
    <>
      <button
        onClick={() => {
          onPay();
          onClose();
        }}
        className='flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex flex-col items-center gap-2 shadow-lg'
      >
        <span className='text-2xl'>💰</span>
        <span>PAY $200</span>
        <span className='text-xs'>(Guaranteed escape)</span>
      </button>

      <button
        onClick={() => {
          onRoll();
          onClose();
        }}
        className='flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex flex-col items-center gap-2 shadow-lg'
      >
        <span className='text-2xl'>🎲</span>
        <span>ROLL DICE</span>
        <span className='text-xs'>(Need roll &gt; 4)</span>
      </button>
    </>
  );

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title="🔒 IN JAIL!"
      size="md"
      buttons={buttons}
    >
      <div className='text-center space-y-4'>
        <p className='text-lg font-semibold'>You&apos;re in jail! Choose your action:</p>
        <p className='text-sm text-gray-600'>
          Pay $200 to escape immediately, or roll dice (need &gt; 4 to escape)
        </p>
        <div className='mt-4 text-xs text-gray-500'>
          ⚠️ You must choose an action to continue
        </div>
      </div>
    </ModalTemplate>
  );
};

export default JailModal;
