import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";

const Header = () => {
  return (
    <header className="w-full py-4 bg-green-700 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-white">
          {" "}
          Ethiopian News | User Management
        </h1>
        <nav className="flex space-x-4">
          <a
            href="mailto:kelaltech24@gmail.com.com"
            className="text-white text-lg hover:text-blue-200"
            aria-label="Email"
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a
            href="https://t.me/kelal_tech24"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-lg hover:text-blue-200"
            aria-label="Telegram"
          >
            <FontAwesomeIcon icon={faTelegram} />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
