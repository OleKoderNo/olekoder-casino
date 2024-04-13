import React, {
  createContext,
  FC,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface BalanceContextType {
  balance: number;
  setBalance: (balance: number) => void;
  winnings: number;
  setWinnings: (winnings: number) => void;
}

const BalanceContext = createContext<BalanceContextType>({
  balance: 1000,
  setBalance: () => {},
  winnings: 0,
  setWinnings: () => {},
});

export const useBalance = () => {
  return useContext(BalanceContext);
};

interface BalanceProviderProps {
  children: ReactNode;
}

export const BalanceProvider: FC<BalanceProviderProps> = ({ children }) => {
  const [balance, setBalanceState] = useState<number>(1000);
  const [winnings, setWinningsState] = useState<number>(0);

  useEffect(() => {
    const initialBalance = localStorage.getItem("balance");
    setBalanceState(initialBalance ? parseInt(initialBalance, 10) : 1000);
    const initialWinnings = localStorage.getItem("winnings");
    setWinningsState(initialWinnings ? parseInt(initialWinnings, 10) : 0);
  }, []);

  // Correct setBalance function to accept a number as an argument
  const setBalance = (balance: number) => {
    localStorage.setItem("balance", balance.toString());
    setBalanceState(balance);
  };

  // Correct setWinnings function to accept a number as an argument
  const setWinnings = (winnings: number) => {
    localStorage.setItem("winnings", winnings.toString());
    setWinningsState(winnings);
  };

  return (
    <BalanceContext.Provider
      value={{ balance, setBalance, winnings, setWinnings }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
