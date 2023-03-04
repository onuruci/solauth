import React from "react";
import { useState, useEffect, useContext, useMemo } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

const WalletHandler = () => {
  const { publicKey, connected, wallet, signMessage } = useWallet();

  useEffect(() => {
    console.log(publicKey);
  }, [publicKey]);

  return(
    <div>
      <div className="buttonlayout">
        <WalletMultiButton >
      </WalletMultiButton>
      </div>
      
    </div>
  );
};

export default WalletHandler;