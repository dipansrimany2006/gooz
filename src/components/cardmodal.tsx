import React from 'react'

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName?: string;
  cardAmount?: string;
  cardIcon?: string;
  onBuy?: () => void;
  onPass?: () => void;
}

const CardModal = ({ isOpen, onClose, cardName, cardAmount, cardIcon, onBuy, onPass }: CardModalProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-black/60 z-50' onClick={onClose}>
      <div className='bg-[url("/Rectangle-23.png")] p-6  shadow-md w-[417px] h-[564px]' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>Card Details</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 text-xl font-bold'
          >
            X
          </button>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <h3 className='text-lg font-semibold'>{cardName}</h3>
          <p className='text-md'>{cardAmount}</p>

          <div className='flex gap-4 mt-6'>
            <img
              src="/buy_img.png"
              alt="Buy"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                onBuy?.();
                onClose();
              }}
            />
            <img
              src="/pass_img.png"
              alt="Pass"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                onPass?.();
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default CardModal;
