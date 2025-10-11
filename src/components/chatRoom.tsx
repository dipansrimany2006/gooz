'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

const ChatRoom = () => {
  const { chatMessages, sendMessage, gameId, walletAddress, wsConnected } = useGame();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || !gameId || !walletAddress || !wsConnected) {
      return;
    }

    const success = sendMessage({
      type: 'MESSAGE',
      gameId: gameId,
      playerId: walletAddress,
      message: inputMessage.trim(),
    });

    if (success) {
      setInputMessage('');
      console.log('✅ Chat message sent');
    } else {
      console.error('❌ Failed to send chat message');
    }
  };

  return (
    <div className=''>
      <div className='bg-[#D9D9D9] h-[700px] w-[300px] border-4 rounded-4xl border-black flex flex-col'>
        {/* Chat Header */}
        <div className='bg-[#F6BB36] border-b-4 border-black p-4 rounded-t-3xl'>
          <h2 className='text-xl font-bold text-center'>💬 CHAT</h2>
        </div>

        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto p-4 space-y-3'>
          {chatMessages.length === 0 ? (
            <div className='text-center text-gray-500 text-sm mt-8'>
              No messages yet.<br />Start chatting!
            </div>
          ) : (
            chatMessages.map((msg, index) => {
              const isOwnMessage = msg.playerId === walletAddress;
              const time = new Date(msg.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={index}
                  className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2 ${
                      isOwnMessage
                        ? 'bg-[#F6BB36] text-black'
                        : 'bg-white text-black'
                    }`}
                  >
                    <div className='text-xs font-bold mb-1'>
                      {isOwnMessage ? 'You' : msg.playerName}
                    </div>
                    <div className='text-sm break-words'>{msg.message}</div>
                    <div className='text-xs text-gray-600 mt-1'>{time}</div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className='p-4 border-t-4 border-black'>
          <div className='flex gap-2'>
            <input
              type='text'
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder='Type a message...'
              className='flex-1 px-3 py-2 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#F6BB36]'
              disabled={!wsConnected || !gameId}
            />
            <button
              type='submit'
              disabled={!inputMessage.trim() || !wsConnected || !gameId}
              className='bg-[#F6BB36] hover:bg-[#F4C430] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold px-4 py-2 rounded-lg border-2 border-black transition-colors'
            >
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
