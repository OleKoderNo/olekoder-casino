import Link from "next/link";
import { FC } from "react";

const Home: FC = () => {
  return (
    <div>
      <h1>Welcome to My Casino Website</h1>
      <p>Ready to play some Blackjack?</p>
      <Link href="/blackjack">Play Blackjack</Link>
    </div>
  );
};

export default Home;
