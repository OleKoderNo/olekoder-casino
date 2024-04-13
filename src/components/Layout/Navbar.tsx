import React, { FC } from "react";
import Link from "next/link";
import { MdOutlineCasino } from "react-icons/md";

interface NavbarProps {
  balance: number;
}

const Navbar: FC<NavbarProps> = ({ balance }) => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <MdOutlineCasino className="text-3xl" />
          <span className="ml-2 text-xl">Casino</span>
        </div>
        <ul className="flex-grow flex-row flex justify-center text-center">
          <Link href="/">
            <li className="px-4 py-2">Home</li>
          </Link>
          <Link href="/blackjack">
            <li className="px-4 py-2">Blackjack</li>
          </Link>
          <Link href="/roulette">
            <li className="px-4 py-2">Roulette</li>
          </Link>
          <Link href="/slotmachine">
            <li className="px-4 py-2">Slot Machine</li>
          </Link>
        </ul>
        <div>
          <span className="mr-4">Balance: ${balance}</span>
          {/* Add balance management functionality */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
