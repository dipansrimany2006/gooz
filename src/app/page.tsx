
import Card from '../components/card';

export default function Home() {
  return (
    <div className="h-screen w-screen p-0 m-0 bg-[url('/Gooz_bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <div className="bg-[url('/white-bg.png')] bg-contain bg-center bg-no-repeat w-[1000px] h-[800px] relative flex items-center justify-center">
        <div className="grid grid-cols-5 grid-rows-4 gap-4 w-full h-full py-12 px-4">
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
              <img src={"/Group 1.png"} alt='' height={250} width={250}/>
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
    </div>
  );
}
