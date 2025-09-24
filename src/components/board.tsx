'use client'
import React, { useState } from 'react'
import Card from './card'
import { Button } from './ui/button'

const Board = () => {
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const randomSpeaker = () => {
    console.log(1);
    const roll = Math.floor(Math.random() * 6) + 1; // generates 1–6
    setDiceRoll(roll);
  }

  return (
    <div className="bg-[url('/white-bg.png')] bg-contain bg-center bg-no-repeat w-[1000px] h-[800px] relative flex items-center justify-center col-span-4">
        <div className="grid grid-cols-5 grid-rows-4 gap-4 w-full h-full py-16 px-4">
          {/* Top row - 5 cards */}
          <div className="grid place-items-center">
            <Card name="Card 1" icon="/yellow_card.png" amount="$100" />
          </div>
          <div className="grid place-items-center">
            <Card name="Card 2" icon="/yellow_card.png" amount="$200" />
          </div>
          <div className="grid place-items-center">
            <Card name="Card 3" icon="/yellow_card.png" amount="$300" />
          </div>
          <div className="grid place-items-center">
            <Card name="Card 4" icon="/yellow_card.png" amount="$400" />
          </div>
          <div className="grid place-items-center">
            <Card name="Card 5" icon="/yellow_card.png" amount="$500" />
          </div>

          {/* Second row - only first and last positions */}
          <div className="grid place-items-center">
            <Card name="Left 1" icon="/yellow_card.png" amount="$600" />
          </div>
          <div className="grid place-items-center col-span-3 row-span-2 rounded-lg">
              <Button onClick={randomSpeaker} className='relative h-[250px] w-[250px]'>
                <img src={"/Group 1.png"} alt='' height={250} width={250} className=''/>
                <div className="absolute bottom-1/2 translate-y-full left-3 text-xl font-bold w-24 h-16 flex items-center justify-center">
                  <img src="/brustBubble_gooz 1.png" alt="" height={120} width={96} className="absolute inset-0 object-contain" />
                  <span className="relative rotate-[-25deg] z-10 top-4 -left-2 text-black">
                    {diceRoll !== null ? `🎲 ${diceRoll}` : "Roll Me"}
                  </span>
                </div>
              </Button>
          </div>
          <div className="grid place-items-center">
            <Card name="Right 1" icon="/yellow_card.png" amount="$700" />
          </div>

          {/* Third row - only first and last positions */}
          <div className="grid place-items-center">
            <Card name="Left 2" icon="/yellow_card.png" amount="$800" />
          </div>
          <div className="grid place-items-center">
            <Card name="Right 2" icon="/yellow_card.png" amount="$900" />
          </div>

          {/* Bottom row - 5 cards */}
          <div className="grid place-items-center">
            <Card name="Card 6" icon="/yellow_card.png" amount="$1000" />
          </div>
          <div className="grid place-items-center">
            <Card name="Card 7" icon="/yellow_card.png" amount="$1100" />
          </div>
          <div className="grid place-items-center">
            <Card name="Card 8" icon="/yellow_card.png" amount="$1200" />
          </div>
          <div className="grid place-items-center">
            <Card name="Card 9" icon="/yellow_card.png" amount="$1300" />
          </div>
          <div className="grid place-items-center">
            <Card name="Card 10" icon="/yellow_card.png" amount="$1400" />
          </div>
        </div>
      </div>
  )
}

export default Board
