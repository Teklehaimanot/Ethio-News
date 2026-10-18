import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="w-full py-4 bg-green-800 text-white shadow-inner">
      <div className="container mx-auto flex justify-between items-center px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Ethiopian News | User Management. All
          rights reserved.
        </p>
        <div className="flex space-x-4">
          <a
            href="mailto:kelaltech24@gmail.com"
            className="hover:text-blue-200"
            aria-label="Email"
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a
            href="https://t.me/kelal_tech24"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-200"
            aria-label="Telegram"
          >
            <FontAwesomeIcon icon={faTelegram} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
