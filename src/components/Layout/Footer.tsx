import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <div className="container mx-auto">
        Made by:{" "}
        <a
          className="underline text-blue-400 hover:text-red-400"
          href="https://www.olekoder.no/"
        >
          OleKoder.no
        </a>
      </div>
    </footer>
  );
};

export default Footer;
