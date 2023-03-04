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

import WalletHandler from "./WalletHandler";
import "./index.css";
import fb from "./fb.png";
import input1 from "./input.png";

global.Buffer = global.Buffer || require("buffer").Buffer;


function App() {
  const [value, setValue] = useState(0);
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
  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    mounted && (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider autoConnect wallets={wallets}>
          <WalletModalProvider>
            <div>
              <div className="w-full">
                <div>.</div>
                <div className="w-3/5 mx-auto mt-20">
                  <div className="flex items-center">
                    <div className=""> <img src={fb}/></div>
                    <div className="loginmodal">
                      <img src={input1}/>
                      <WalletHandler/>
                    </div>
                  </div>
                  
                </div>
                
              </div>
              <div>

              </div>
            </div>
            
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    )
  );
}

export default App;
