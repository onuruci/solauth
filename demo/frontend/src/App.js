import React from "react";
import { useState, useEffect, useContext, useMemo } from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import * as web3 from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import bg from "./utils/images/ubuntu_background.jpg";
import WalletHandler from "./WalletHandler";
import "./index.css";
import fb from "./utils/images/fb.png";
import input1 from "./utils/images/input.png";
import { useWallet } from "@solana/wallet-adapter-react";
import { ENDPOINT } from "./utils/constants";
import Login from "./Login";
import axios from "axios";
import { Link } from "react-router-dom";

global.Buffer = global.Buffer || require("buffer").Buffer;

function App() {
  const [value, setValue] = useState(0);
  const [currentProfile, setCurrentProfile] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const endpoint = web3.clusterApiUrl("devnet");
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const [mounted, setMounted] = useState(false);
  console.log(currentProfile);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider autoConnect wallets={wallets}>
          <WalletModalProvider>
            {!currentProfile ? (
              <Login setCurrentProfile={setCurrentProfile} />
            ) : (
              <div className="w-full h-full">
                <div className="w-full h-auto shadow bg-white rounded-md">
                  <div className="max-w-6xl h-full mx-auto bg-white p-2">
                    <div
                      className="h-96 max-h-96 w-full rounded-lg relative"
                      style={{
                        backgroundImage: `url(${bg})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div
                        className="absolute  w-full flex items-center justify-center"
                        style={{ bottom: "-15px" }}
                      >
                        <div className="w-44 h-44 rounded-full bg-gray-300 border-4 border-white">
                          <img
                            className="w-full h-full rounded-full"
                            src={currentProfile.imageUrl}
                            alt="dp"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="max-w-5xl h-full mx-auto">
                      <div className="flex flex-col space-y-2 mt-3 items-center justify-center pb-3">
                        <p className="text-4xl font-bold">
                          {currentProfile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {currentProfile.mail}
                        </p>
                        <WalletHandler setCurrentProfile={setCurrentProfile} />
                      </div>
                      <div className="flex items-center justify-center gap-12 absolute bottom-8 left-0 right-0">
                        <button className="py-3 px-2 hover:bg-gray-100 rounded-md font-semibold focus:outline-none">
                          NFT's
                        </button>
                        <button className="py-3 px-2 hover:bg-gray-100 rounded-md font-semibold focus:outline-none">
                          About
                        </button>
                        <button className="py-3 px-2 hover:bg-gray-100 rounded-md font-semibold focus:outline-none">
                          Friends
                        </button>
                        <button className="py-3 px-2 hover:bg-gray-100 rounded-md font-semibold focus:outline-none">
                          Photos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    )
  );
}

export default App;
