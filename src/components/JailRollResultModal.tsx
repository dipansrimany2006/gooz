'use client'

import React from 'react';
import ModalTemplate from './ModalTemplate';

interface JailRollResultModalProps {
  isOpen: boolean;
  diceRoll: number;
  escaped: boolean;
  onClose: () => void;
}

const JailRollResultModal = ({ isOpen, diceRoll, escaped, onClose }: JailRollResultModalProps) => {
  const buttons = (
    <button
      onClick={onClose}
      className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg'
    >
      OK
    </button>
  );

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title={escaped ? "🎉 ESCAPED JAIL!" : "🔒 STILL IN JAIL"}
      size="md"
      buttons={buttons}
    >
      <div className={`border-2 rounded-lg p-6 w-full ${escaped ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className='text-center space-y-4'>
          <div className='flex justify-center items-center gap-2'>
            <span className='text-4xl'>🎲</span>
            <p className='text-5xl font-bold text-blue-600'>{diceRoll}</p>
          </div>

          {escaped ? (
            <>
              <p className='text-xl font-semibold text-green-700'>
                🎉 You rolled {diceRoll} and escaped jail!
              </p>
              <p className='text-sm text-gray-600'>
                You needed a roll &gt; 4 to escape. You&apos;re free!
              </p>
            </>
          ) : (
            <>
              <p className='text-xl font-semibold text-red-700'>
                😔 You rolled {diceRoll} and remain in jail
              </p>
              <p className='text-sm text-gray-600'>
                You needed a roll &gt; 4 to escape. Better luck next time!
              </p>
            </>
          )}
        </div>
      </div>
    </ModalTemplate>
  );
};

export default JailRollResultModal;
