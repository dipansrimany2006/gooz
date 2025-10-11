'use client'

import React from 'react';

interface SellPropertiesModalProps {
  isOpen: boolean;
  rentAmount: number;
  currentMoney: number;
  ownedProperties: string[];
  onSellProperty: (propertyName: string) => void;
  onClose: () => void;
}

const SellPropertiesModal = ({
  isOpen,
  rentAmount,
  currentMoney,
  ownedProperties,
  onSellProperty,
  onClose
}: SellPropertiesModalProps) => {
  if (!isOpen) return null;

  const moneyNeeded = rentAmount - currentMoney;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/60 z-50' onClick={onClose}>
      <div className='bg-white rounded-lg p-8 shadow-2xl w-[600px] max-h-[80vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-red-600'>💸 INSUFFICIENT FUNDS!</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 text-xl font-bold'
          >
            ✕
          </button>
        </div>

        <div className='mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4'>
          <div className='text-center'>
            <p className='text-lg font-bold mb-2'>You need to pay rent!</p>
            <div className='flex justify-around text-sm'>
              <div>
                <p className='text-gray-600'>Current Money</p>
                <p className='text-xl font-bold'>${currentMoney}</p>
              </div>
              <div>
                <p className='text-gray-600'>Rent Due</p>
                <p className='text-xl font-bold text-red-600'>${rentAmount}</p>
              </div>
              <div>
                <p className='text-gray-600'>Need</p>
                <p className='text-xl font-bold text-red-600'>+${moneyNeeded}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <h3 className='text-lg font-bold mb-3'>🏠 Sell Properties to Raise Funds:</h3>
          {ownedProperties.length === 0 ? (
            <div className='text-center p-8 bg-gray-50 rounded-lg'>
              <p className='text-lg font-bold text-red-600 mb-2'>💔 NO PROPERTIES TO SELL</p>
              <p className='text-sm text-gray-600'>You will be declared bankrupt!</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {ownedProperties.map((property, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <div>
                    <p className='font-bold'>{property}</p>
                    <p className='text-xs text-gray-600'>Sell for 60% of purchase price</p>
                  </div>
                  <button
                    onClick={() => onSellProperty(property)}
                    className='bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors'
                  >
                    SELL
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='mt-6 text-center text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-3'>
          ⚠️ You must sell properties to cover the rent or you&apos;ll be declared bankrupt!
        </div>
      </div>
    </div>
  );
};

export default SellPropertiesModal;
