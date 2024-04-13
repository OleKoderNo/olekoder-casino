import React, { FC } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useBalance } from "@/context/BalanceContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { balance } = useBalance(); // Access balance from context

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar balance={balance} />
      <main className="flex-grow container mx-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
