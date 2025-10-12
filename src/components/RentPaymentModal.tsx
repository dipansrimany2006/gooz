'use client'

import React from 'react';
import ModalTemplate from './ModalTemplate';

interface RentPaymentModalProps {
  isOpen: boolean;
  ownerName: string;
  amount: number;
  propertyName: string;
  onClose: () => void;
}

const RentPaymentModal = ({ isOpen, ownerName, amount, propertyName, onClose }: RentPaymentModalProps) => {
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
      title="💸 RENT PAID!"
      size="md"
      buttons={buttons}
    >
      <div className='bg-red-50 border-2 border-red-200 rounded-lg p-6 w-full'>
        <div className='text-center space-y-4'>
          <p className='text-lg'>You paid rent for landing on</p>
          <p className='text-2xl font-bold text-blue-600'>{propertyName}</p>
          <div className='flex justify-center items-center'>
            <div>
              <p className='text-sm text-gray-600'>Amount Paid</p>
              <p className='text-3xl font-bold text-red-600'>${amount}</p>
            </div>
          </div>
          <p className='text-lg'>
            to <span className='font-bold text-green-600'>{ownerName}</span>
          </p>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default RentPaymentModal;
