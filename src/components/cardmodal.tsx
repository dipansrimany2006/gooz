import React from 'react'
import ModalTemplate from './ModalTemplate'

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName?: string;
  cardAmount?: string;
  cardIcon?: string;
  cardDescription?: string;
  cardRent?: number;
  cardImage?: string;
  onBuy?: () => void;
  onPass?: () => void;
}

const CardModal = ({ isOpen, onClose, cardName, cardAmount, cardIcon, cardDescription, cardRent, cardImage, onBuy, onPass }: CardModalProps) => {
  const buttons = (
    <>
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
    </>
  );

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title="Property Details"
      size="md"
      buttons={buttons}
    >
      <div className='flex flex-col items-center gap-4 w-full'>
        {/* Property Name */}
        <h3 className='text-2xl font-bold text-center'>{cardName}</h3>

        {/* Property Image */}
        {cardImage && (
          <div className='w-48 h-32 bg-gray-200 rounded-lg overflow-hidden'>
            <img
              src={cardImage}
              alt={cardName}
              className='w-full h-full object-cover'
              onError={(e) => {
                // Fallback if image doesn't exist
                (e.target as HTMLImageElement).src = cardIcon || '/yellow_card.png';
              }}
            />
          </div>
        )}

        {/* Property Description */}
        {cardDescription && (
          <p className='text-sm text-gray-600 text-center px-4 italic'>
            {cardDescription}
          </p>
        )}

        {/* Price and Rent in a Row */}
        <div className='flex gap-8 mt-2'>
          <div className='text-center'>
            <p className='text-xs text-gray-500 uppercase'>Price</p>
            <p className='text-xl font-bold text-blue-600'>{cardAmount || '$0'}</p>
          </div>
          {cardRent !== undefined && (
            <div className='text-center'>
              <p className='text-xs text-gray-500 uppercase'>Rent</p>
              <p className='text-xl font-bold text-red-600'>${cardRent}</p>
            </div>
          )}
        </div>
      </div>
    </ModalTemplate>
  )
}

export default CardModal;
