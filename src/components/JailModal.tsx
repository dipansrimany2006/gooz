'use client'

import React from 'react';

interface JailModalProps {
  isOpen: boolean;
  onPay: () => void;
  onRoll: () => void;
  onClose: () => void;
}

const JailModal = ({ isOpen, onPay, onRoll, onClose }: JailModalProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/60 z-50' onClick={onClose}>
      <div className='bg-white rounded-lg p-8 shadow-2xl w-[500px]' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-red-600'>🔒 IN JAIL!</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 text-xl font-bold'
          >
            ✕
          </button>
        </div>

        <div className='mb-6 text-center'>
          <p className='text-lg mb-2'>You&apos;re in jail! Choose your action:</p>
          <p className='text-sm text-gray-600'>Pay $200 to escape immediately, or roll dice (need &gt; 4 to escape)</p>
        </div>

        <div className='flex gap-4'>
          <button
            onClick={() => {
              onPay();
              onClose();
            }}
            className='flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex flex-col items-center gap-2'
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
            className='flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex flex-col items-center gap-2'
          >
            <span className='text-2xl'>🎲</span>
            <span>ROLL DICE</span>
            <span className='text-xs'>(Need roll &gt; 4)</span>
          </button>
        </div>

        <div className='mt-4 text-center text-xs text-gray-500'>
          ⚠️ You must choose an action to continue
        </div>
      </div>
    </div>
  );
};

export default JailModal;
