interface PlayerPosition {
  playerId: string;
  name: string;
  colorCode: string;
  currentPosition: number;
}

interface CardProps {
  name: string;
  icon: string;
  amount: string;
  isSpecial?: boolean;
  position: number;
  players?: PlayerPosition[];
  onClick?: () => void;
}

export default function Card({ name, icon, amount, isSpecial = false, position, players = [], onClick }: CardProps) {
  // Filter players at this card's position (position is already transformed)
  const playersAtPosition = players.filter(player => player.currentPosition === position);

  return (
    <div
      className="relative w-40 h-40 flex items-center justify-center border-4 bg-[#F6BB36] rounded-4xl cursor-pointer hover:bg-[#F4C430] transition-colors"
      onClick={onClick}
    >
      {/* <img
        src="/yellow-card.png"
        alt="card background"
        className="absolute inset-0 w-full h-full object-contain"
      /> */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
        <span className="text-black text-sm uppercase font-chewy">{name}</span>
        {/* <img src={icon} alt={name} className="w-12 h-12" /> */}
        <span className="text-black text-sm">{amount}</span>
      </div>

      {/* Player indicators positioned absolutely on top of card */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {playersAtPosition.map((player) => (
          <div
            key={player.playerId}
            className="w-6 h-6 rounded-full border-2 border-white text-xs flex items-center justify-center font-bold text-white shadow-lg"
            style={{
              backgroundColor: player.colorCode,
            }}
            title={player.name}
          >
            {player.name.charAt(0)}
          </div>
        ))}
      </div>

      {isSpecial && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
          10% + 18%
        </div>
      )}
    </div>
  );
}