import React, { FC, useEffect, useState } from "react";
import { useBalance } from "@/context/BalanceContext"; // Import useBalance hook
import Card from "@/components/Card";

type Balance = {
  balance: number;
  setBalance: (balance: number) => void;
  winnings: number;
  setWinnings: (winnings: number) => void;
};

interface Card {
  suit: string;
  value: string;
}

const Blackjack: FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [dealerHiddenCard, setDealerHiddenCard] = useState<Card | null>(null);
  const [gameResult, setGameResult] = useState<string | null>(null); // State variable to hold game result
  const [betAmount, setBetAmount] = useState<number>(0); // Current bet amount
  const { balance, setBalance, winnings, setWinnings } = useBalance(); // Access balance from context
  const [pot, setPot] = useState<number>(0); // Pot for accumulated bets
  const [gameInProgress, setGameInProgress] = useState<boolean>(false); // Track whether the game is in progress
  const [gameMessage, setGameMessage] = useState<string>(
    "Place your bet and start the game."
  ); // Game status message
  const [initialBalance, setInitialBalance] = useState<number>(0); // Initial balance

  useEffect(() => {
    // Initialize the deck and shuffle it when the component mounts
    initDeck();
    // Fetch initial balance from local storage and set it
    const storedInitialBalance = parseInt(
      localStorage.getItem("initialBalance") || "1000",
      10
    );
    setInitialBalance(storedInitialBalance);
  }, []); // Empty dependency array ensures this effect runs only once

  // Function to initialize the deck with one set of cards
  const initDeck = () => {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const values = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];

    const newDeck: Card[] = [];
    for (let i = 0; i < 4; i++) {
      // Loop four times for four sets of cards
      for (let suit of suits) {
        for (let value of values) {
          newDeck.push({ suit, value });
        }
      }
    }
    shuffleDeck(newDeck);
    setDeck(newDeck);
  };

  // Function to shuffle the deck
  const shuffleDeck = (deckToShuffle: Card[]) => {
    for (let i = deckToShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deckToShuffle[i], deckToShuffle[j]] = [
        deckToShuffle[j],
        deckToShuffle[i],
      ];
    }
  };

  // Function to deal a card from the deck
  const dealCard = () => {
    if (deck.length === 0) {
      console.error("Deck is empty. Please shuffle the deck.");
      return null;
    }
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];
    const newDeck = [...deck];
    newDeck.splice(randomIndex, 1); // Remove the dealt card from the deck
    setDeck(newDeck); // Update the deck state
    return card;
  };

  // Function to calculate the value of a hand
  const calculateHandValue = (hand: Card[]) => {
    let sum = 0;
    let hasAce = false;
    for (let card of hand) {
      if (card && card.value === "A") {
        // Add null check for card
        hasAce = true;
      }
      if (card && ["J", "Q", "K"].includes(card.value)) {
        // Add null check for card
        sum += 10;
      } else if (card && card.value !== "A") {
        // Add null check for card
        sum += parseInt(card.value);
      }
    }
    if (hasAce) {
      if (sum + 11 <= 21) {
        sum += 11;
      } else {
        sum += 1;
      }
    }
    return sum;
  };

  // Function to start a new game
  const startGame = () => {
    if (betAmount === 0) {
      setGameMessage("Place a bet before starting the game.");
      return;
    }
    if (gameInProgress) {
      setGameMessage("Finish the current round before starting a new game.");
      return;
    }

    // Reset game state
    setPlayerHand([]);
    setDealerHand([]);
    setDealerHiddenCard(null);
    setGameResult(null);
    setGameInProgress(true);
    setGameMessage("Game in progress...");
    setPot(0);
    setWinnings(0); // Reset winnings to 0

    // Deal initial cards to player and dealer
    const newPlayerHand: Card[] = [];
    const newDealerHand: Card[] = [];

    // Deal two cards alternating between player and dealer
    const cardsToDeal = 2;
    const allDealtCards: Card[] = [];
    for (let i = 0; i < cardsToDeal; i++) {
      const playerCard = dealCard()!;
      const dealerCard = dealCard()!;
      allDealtCards.push(playerCard, dealerCard);
      newPlayerHand.push(playerCard);
      newDealerHand.push(dealerCard);
    }

    // If the dealer's second card is an Ace or a card with a value of 10, it's a potential blackjack
    const dealerSecondCard = newDealerHand[1];
    if (
      dealerSecondCard &&
      (dealerSecondCard.value === "A" ||
        ["10", "J", "Q", "K"].includes(dealerSecondCard.value))
    ) {
      // Reveal the second card of the dealer
      setDealerHiddenCard(null);
    } else {
      // Hide the second card of the dealer
      setDealerHiddenCard(dealerSecondCard);
    }

    // Set the hands
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);

    // Remove only one instance of each dealt card from the deck array
    const updatedDeck = deck.filter((card) => {
      const foundIndex = allDealtCards.findIndex(
        (dealtCard) =>
          dealtCard.value === card.value && dealtCard.suit === card.suit
      );
      if (foundIndex !== -1) {
        allDealtCards.splice(foundIndex, 1); // Remove the dealt card from the list of dealt cards
        return false; // Do not include this card in the updated deck
      }
      return true; // Include all other cards in the updated deck
    });
    setDeck(updatedDeck);
  };

  // Function to handle player's hit action
  const handleHit = () => {
    if (!gameInProgress) {
      setGameMessage("Start a new game before hitting.");
      return;
    }

    if (betAmount === 0) {
      setGameMessage("Place a bet before drawing cards.");
      return;
    }

    if (calculateHandValue(playerHand) > 21) {
      // Player has already busted, do not allow further actions
      setGameMessage("Player has already busted.");
      setGameInProgress(false);
      return;
    }

    if (gameResult !== null) {
      // Player has already won or lost, do not allow further actions
      setGameMessage("The round has ended. Start a new game.");
      setGameInProgress(false);
      return;
    }

    const newPlayerHand = [...playerHand, dealCard()!];
    setPlayerHand(newPlayerHand);
    const playerHandValue = calculateHandValue(newPlayerHand);
    console.log(
      "Player hits. New hand:",
      newPlayerHand,
      "Value:",
      playerHandValue
    );

    // Check if player busts
    if (playerHandValue > 21) {
      console.log("Player busts!");
      setGameResult("Player busts! Dealer wins!");
      setGameInProgress(false); // End the game
      // Handle end of game logic (dealer wins)
    }
  };

  // Function to handle player's stand action
  const handleStand = () => {
    if (!gameInProgress) {
      setGameMessage("Start a new game before standing.");
      return;
    }

    // Dealer reveals hidden card
    setDealerHiddenCard(null);

    // Dealer draws until hand value is >= 17
    let newDealerHand = [...dealerHand];
    while (calculateHandValue(newDealerHand) < 17) {
      newDealerHand.push(dealCard()!);
    }
    setDealerHand(newDealerHand);
    const dealerHandValue = calculateHandValue(newDealerHand);
    console.log(
      "Dealer stands with hand:",
      newDealerHand,
      "Value:",
      dealerHandValue
    );

    // Check win/lose conditions
    const playerValue = calculateHandValue(playerHand);
    if (dealerHandValue > 21 || playerValue > dealerHandValue) {
      // Player wins or dealer busts
      if (playerHand.length === 2 && playerValue === 21) {
        // Blackjack win (3 to 2 payout)
        setGameResult("Blackjack! Player wins!");
        const blackjackWinnings = betAmount + Math.floor((betAmount * 3) / 2);
        setBalance(balance + blackjackWinnings);
        setWinnings(blackjackWinnings);
      } else {
        // Regular win (double amount back)
        setGameResult("Player wins!");
        const regularWinnings = betAmount * 2;
        setBalance(balance + regularWinnings);
        setWinnings(regularWinnings);
      }
      setPot(0); // Reset pot
    } else if (playerValue < dealerHandValue) {
      // Dealer wins
      setGameResult("Dealer wins!");
      setPot(0); // Reset pot
    } else {
      // It's a tie
      setGameResult("It's a tie!");
      // Refund the bet amount in case of a tie
      setBalance(balance + betAmount);
      setPot(0); // Reset pot
    }

    // End the game
    setGameInProgress(false);
  };
  // Function to handle player's double down action
  const handleDoubleDown = () => {
    if (playerHand.length !== 2) {
      setGameMessage(
        "Double Down is only available after the first two cards are dealt."
      );
      return;
    }
    if (betAmount * 2 > balance) {
      setGameMessage("Insufficient balance for Double Down.");
      return;
    }

    // Deal one additional card to the player
    const newPlayerHand = [...playerHand, dealCard()!];
    setPlayerHand(newPlayerHand);

    // Check if player busts
    const playerHandValue = calculateHandValue(newPlayerHand);
    if (playerHandValue > 21) {
      console.log("Player busts!");
      // Handle end of game logic (dealer wins)
    } else {
      // If player didn't bust, automatically stand after doubling down
      handleStand();
    }
  };

  const handleDealerShuffle = () => {
    if (gameInProgress) {
      setGameMessage("Cannot shuffle while a game is in progress.");
      console.log("Cannot shuffle while a game is in progress.");
      return;
    }

    // Reset game-related state
    setPlayerHand([]);
    setDealerHand([]);
    setDealerHiddenCard(null);
    setGameResult(null);
    setGameMessage("Place your bet and start the game.");
    setGameInProgress(false);

    // Reset the deck and shuffle
    initDeck();
    shuffleDeck(deck);
    console.log("Dealer shuffled the deck and cleared the board.");
  };

  // Function to handle betting action
  const handleBet = (amount: number) => {
    if (gameInProgress) {
      setGameMessage("Cannot make bets while the game is in progress.");
      return;
    }
    if (amount > balance) {
      alert("Insufficient balance!");
      return;
    }
    setBetAmount(amount);
    setPot(pot + amount);
    setBalance(balance - amount); // Update balance from context
  };

  // Function to handle resetting the balance
  const handleResetBalance = () => {
    setBalance(1000); // Assuming 1000 is the initial balance
    setWinnings(0); // Reset winnings
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Blackjack Game</h1>
      <div className="mb-4">
        <p>{gameMessage}</p>
        <p>Player Score: {calculateHandValue(playerHand)}</p>
        <p>
          Dealer Score:{" "}
          {dealerHiddenCard
            ? `${calculateHandValue([dealerHand[0]])} ?`
            : calculateHandValue(dealerHand)}
        </p>
      </div>
      <div>
        <h2>Player's Hand:</h2>
        <div className="flex">
          {playerHand.map(
            (card, index) =>
              card && <Card key={index} suit={card.suit} value={card.value} />
          )}
        </div>
      </div>
      <div>
        <h2>Dealer's Hand:</h2>
        <div className="flex">
          {dealerHand.map((card, index) => (
            <div key={index}>
              {index === 1 && dealerHiddenCard ? (
                <div className="w-32 h-48 bg-green-500 rounded-lg shadow-md"></div> // Placeholder for card back
              ) : (
                card && <Card suit={card.suit} value={card.value} />
              )}
            </div>
          ))}
        </div>
      </div>
      {gameResult && <p className="text-red-500">{gameResult}</p>}{" "}
      {/* Display game result message */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={startGame}
        disabled={gameInProgress || betAmount === 0}
      >
        Start Game
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
        onClick={handleHit}
        disabled={!gameInProgress || betAmount === 0}
      >
        Hit
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
        onClick={handleStand}
        disabled={!gameInProgress || betAmount === 0}
      >
        Stand
      </button>
      <button
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-4"
        onClick={handleDoubleDown}
        disabled={!gameInProgress || betAmount === 0 || playerHand.length !== 2}
      >
        Double Down
      </button>
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-4"
        onClick={handleDealerShuffle}
        disabled={gameInProgress}
      >
        Request Shuffle ({deck.length} cards left)
      </button>
      <div className="flex space-x-2">
        {/* Bet buttons */}
        <button
          onClick={() => handleBet(5)}
          disabled={gameInProgress}
          className="inline-block px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 text-white"
        >
          Bet 5
        </button>
        <button
          onClick={() => handleBet(10)}
          disabled={gameInProgress}
          className="inline-block px-4 py-2 rounded bg-green-500 hover:bg-green-700 text-white"
        >
          Bet 10
        </button>
        <button
          onClick={() => handleBet(25)}
          disabled={gameInProgress}
          className="inline-block px-4 py-2 rounded bg-red-500 hover:bg-red-700 text-white"
        >
          Bet 25
        </button>
        <button
          onClick={() => handleBet(50)}
          disabled={gameInProgress}
          className="inline-block px-4 py-2 rounded bg-purple-500 hover:bg-purple-700 text-white"
        >
          Bet 50
        </button>
        <button
          onClick={() => handleBet(100)}
          disabled={gameInProgress}
          className="inline-block px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-700 text-white"
        >
          Bet 100
        </button>
        <button
          onClick={() => handleBet(balance)}
          disabled={gameInProgress}
          className="inline-block px-4 py-2 rounded bg-teal-500 hover:bg-teal-700 text-white"
        >
          All In
        </button>
      </div>
      <div>
        <p>Winnings: {winnings}</p>
        <p>Balance: {balance}</p>
        <p>Pot: {pot}</p>
      </div>
      <button onClick={handleResetBalance}>Reset Balance</button>
    </div>
  );
};

export default Blackjack;
