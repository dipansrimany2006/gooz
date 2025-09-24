
import Card from '../components/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('/Gooz_bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <div className="bg-[url('/white-bg.png')] bg-contain bg-center bg-no-repeat w-[800px] h-[600px] relative flex items-center justify-center">
        <div className="grid grid-cols-5 grid-rows-4 gap-4 w-full h-full p-8">
          {/* Top row - 5 cards */}
          <Card name="Card 1" icon="/yellow_card.png" amount="$100" />
          <Card name="Card 2" icon="/yellow_card.png" amount="$200" />
          <Card name="Card 3" icon="/yellow_card.png" amount="$300" />
          <Card name="Card 4" icon="/yellow_card.png" amount="$400" />
          <Card name="Card 5" icon="/yellow_card.png" amount="$500" />

          {/* Second row - only first and last positions */}
          <Card name="Left 1" icon="/yellow_card.png" amount="$600" />
          <div className="col-span-3 row-span-2 rounded-lg flex items-center justify-center">
            <img src={"/Group 1.png"} alt=''/>
          </div>
          <Card name="Right 1" icon="/yellow_card.png" amount="$700" />

          {/* Third row - only first and last positions */}
          <Card name="Left 2" icon="/yellow_card.png" amount="$800" />
          <Card name="Right 2" icon="/yellow_card.png" amount="$900" />

          {/* Bottom row - 5 cards */}
          <Card name="Card 6" icon="/yellow_card.png" amount="$1000" />
          <Card name="Card 7" icon="/yellow_card.png" amount="$1100" />
          <Card name="Card 8" icon="/yellow_card.png" amount="$1200" />
          <Card name="Card 9" icon="/yellow_card.png" amount="$1300" />
          <Card name="Card 10" icon="/yellow_card.png" amount="$1400" />
        </div>
      </div>
    </div>
  );
}
