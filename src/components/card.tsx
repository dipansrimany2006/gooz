interface CardProps {
  name: string;
  icon: string;
  amount: string;
  isSpecial?: boolean;
}

export default function Card({ name, icon, amount, isSpecial = false }: CardProps) {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center bg-[url('/yellow_card.png')] bg-contain bg-center bg-no-repeat">
      {/* <img 
        src="/yellow-card.png" 
        alt="card background" 
        className="absolute inset-0 w-full h-full object-contain"
      /> */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
        <span className="text-black font-bold text-sm uppercase">{name}</span>
        {/* <img src={icon} alt={name} className="w-12 h-12" /> */}
        <span className="text-black font-bold text-sm">{amount}</span>
      </div>
      {isSpecial && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
          10% + 18%
        </div>
      )}
    </div>
  );
}