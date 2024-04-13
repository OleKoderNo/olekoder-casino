import { FC } from "react";
import { ImHeart, ImDiamonds, ImSpades, ImClubs } from "react-icons/im";

interface CardProps {
  suit: string;
  value: string;
  isHidden?: boolean; // Add a prop to indicate if the card is hidden
}

const Card: FC<CardProps> = ({ suit, value, isHidden = false }) => {
  const getSuitIcon = (suit: string) => {
    switch (suit) {
      case "Hearts":
        return <ImHeart className="text-red-500" />;
      case "Diamonds":
        return <ImDiamonds className="text-red-500" />;
      case "Spades":
        return <ImSpades className="text-black" />;
      case "Clubs":
        return <ImClubs className="text-black" />;
      default:
        return null;
    }
  };

  const renderCardContent = () => {
    if (isHidden) {
      // Render the back of the card if it's hidden
      return (
        <div className="bg-blue-500 w-full h-full rounded-lg">
          {/* Add any design for the back of the card here */}
        </div>
      );
    } else {
      // Render the front of the card if it's not hidden
      return (
        <div className="relative w-full h-full">
          <div className="absolute top-1 left-1 text-2xl">
            {getSuitIcon(suit)}
          </div>
          <div className="absolute bottom-1 right-1 text-2xl">
            {getSuitIcon(suit)}
          </div>
          <div className="flex flex-col justify-center items-center h-full">
            <div className="text-2xl">{value}</div>
            <div className="text-lg">{getSuitIcon(suit)}</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative w-32 h-48 bg-white rounded-lg shadow-md">
      {renderCardContent()}
    </div>
  );
};

export default Card;
