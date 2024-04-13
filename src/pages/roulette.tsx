import React, { FC, useEffect, useState } from "react";
import { useBalance } from "@/context/BalanceContext"; // Import useBalance hook
import styles from "../styles/roulette.module.css";

const Roulette: FC = () => {
  const [wheel, setWheel] = useState<string[]>([]);
  const [lastWinningColor, setLastWinningColor] = useState<string>(""); // State for the last winning color
  const [pot, setPot] = useState<number>(0); // Pot for accumulated bets
  const { balance, setBalance, winnings, setWinnings } = useBalance(); // Access balance from context
  const [gameInProgress, setGameInProgress] = useState<boolean>(false); // Track whether the game is in progress
  const [gameMessage, setGameMessage] = useState<string>(
    "Place your bet and start the game."
  ); // Game status message
  const [initialBalance, setInitialBalance] = useState<number>(0); // Initial balance

  useEffect(() => {
    initWheel();
    // Fetch initial balance from local storage and set it
    const storedInitialBalance = parseInt(
      localStorage.getItem("initialBalance") || "1000",
      10
    );
    setInitialBalance(storedInitialBalance);
  }, []); // Empty dependency array ensures this effect runs only once

  // Function to initialize the wheel with numbers and colors
  const initWheel = () => {
    const wheelNumbers = Array.from({ length: 38 }, (_, i) =>
      i === 0 ? "00" : i === 37 ? "0" : i.toString()
    );
    setWheel(wheelNumbers);
  };

  // Function to start a new game
  const startGame = () => {
    if (gameInProgress) {
      setGameMessage("Finish the current round before starting a new game.");
      return;
    }
    if (pot === 0) {
      setGameMessage("Place a bet before starting the game.");
      return;
    }

    // Reset game state
    setGameInProgress(true);
    setGameMessage("Spinning the wheel...");
    setWinnings(0); // Reset winnings to 0

    // Generate winning number
    const winningNumber = wheel[Math.floor(Math.random() * wheel.length)];
    console.log(`Winning number: ${winningNumber}`);

    // Determine if the selected color wins
    let playerWins = false;
    if (
      (lastWinningColor === "red" && parseInt(winningNumber) % 2 !== 0) ||
      (lastWinningColor === "black" && parseInt(winningNumber) % 2 === 0)
    ) {
      // Player wins on red or black
      playerWins = true;
    } else if (
      (lastWinningColor === "green" && winningNumber === "0") ||
      winningNumber === "00"
    ) {
      // Player wins on green
      playerWins = true;
    }

    // Update game message based on result
    if (playerWins) {
      setGameMessage("Congratulations! You won!");
    } else {
      setGameMessage("Sorry, you lost.");
    }

    // Calculate winnings and update balance
    const totalWinnings = playerWins ? pot * 2 : 0; // Double the pot if player wins
    const balanceChange = playerWins ? totalWinnings - pot : -pot; // Subtract pot if player loses
    setWinnings(totalWinnings);
    setBalance(balance + balanceChange);

    // Reset game
    setPot(0);
    setGameInProgress(false);
  };

  // Function to handle betting action
  const handleBet = (amount: number, color: string) => {
    if (gameInProgress) {
      setGameMessage("Cannot make bets while the game is in progress.");
      return;
    }
    if (amount > balance) {
      alert("Insufficient balance!");
      return;
    }
    setPot(pot + amount);
    setBalance(balance - amount); // Update balance from context
    setLastWinningColor(color); // Update last winning color
  };

  // Function to handle resetting the balance
  const handleResetBalance = () => {
    setBalance(1000); // Assuming 1000 is the initial balance
    setWinnings(0); // Reset winnings
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Roulette Game</h1>
      <div className={styles.container}>
        <ul className={`${styles.circle} flex items-center justify-center`}>
          {wheel.map((number, index) => (
            <li
              key={index}
              className={`text-white text-center ${
                number === "00" || number === "0"
                  ? "bg-green-500"
                  : parseInt(number) % 2 === 0
                  ? "bg-black"
                  : "bg-red-500"
              }`}
            >
              {number}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center items-center mb-4">
        {/* Display the spin result as a box showing the last winning color */}
        {gameInProgress && (
          <div
            className={`w-20 h-20 rounded-lg flex items-center justify-center ${
              lastWinningColor === "red"
                ? "bg-red-500"
                : lastWinningColor === "black"
                ? "bg-black"
                : "bg-green-500"
            }`}
          ></div>
        )}
      </div>
      <div className="flex space-x-2 mt-4">
        {/* Bet buttons */}
        <button
          onClick={() => handleBet(5, "red")}
          disabled={gameInProgress}
          className="inline-block px-4 py-2 rounded bg-red-500 hover:bg-red-700 text-white"
        >
          Bet Red 5
        </button>
        <button
          onClick={() => handleBet(5, "black")}
          disabled={gameInProgress}
          className="inline-block px-4 py-2 rounded bg-black hover:bg-gray-700 text-white"
        >
          Bet Black 5
        </button>
        <button
          onClick={() => handleBet(5, "green")}
          disabled={gameInProgress}
          className="inline-block px-4 py-2 rounded bg-green-500 hover:bg-green-700 text-white"
        >
          Bet Green 5
        </button>
      </div>
      <div className="flex mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={startGame}
          disabled={gameInProgress || pot === 0}
        >
          Spin
        </button>
      </div>
      <div>
        <p>Winnings: {winnings}</p>
        <p>Balance: {balance}</p>
        <p>Pot: {pot}</p>
      </div>
      <button onClick={handleResetBalance}>Reset Balance</button>
      <p>{gameMessage}</p>
    </div>
  );
};

export default Roulette;
