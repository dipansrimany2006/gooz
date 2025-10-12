'use client'

import React, { ReactNode } from 'react';

interface ModalTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  buttons?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
}

const ModalTemplate = ({
  isOpen,
  onClose,
  title,
  children,
  buttons,
  size = 'md',
  showCloseButton = true
}: ModalTemplateProps) => {
  if (!isOpen) return null;

  // Size mapping
  const sizeClasses = {
    sm: 'w-[350px] min-h-[450px] max-h-[80vh]',
    md: 'w-[417px] min-h-[564px] max-h-[80vh]',
    lg: 'w-[600px] min-h-[650px] max-h-[80vh]'
  };

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-black/60 z-50'
      onClick={onClose}
    >
      <div
        className={`bg-[url("/Rectangle-23.png")] bg-cover bg-center p-6 shadow-md ${sizeClasses[size]} flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Layer */}
        <div className='flex justify-between items-center mb-4 flex-shrink-0'>
          <h2 className='text-xl font-bold'>{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors'
            >
              ✕
            </button>
          )}
        </div>

        {/* Body Layer */}
        <div className='flex flex-col items-center overflow-y-auto flex-1 mb-4'>
          {children}
        </div>

        {/* Button Layer */}
        {buttons && (
          <div className='flex justify-center gap-4 mt-4 flex-shrink-0'>
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalTemplate;
