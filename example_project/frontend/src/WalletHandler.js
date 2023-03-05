import React from "react";
import { useState, useEffect, useContext, useMemo } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { HASH, ENDPOINT } from "./utils/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

const WalletHandler = () => {
  const { publicKey, connected, wallet, signMessage } = useWallet();
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    async function getSignature() {
      const message = "sign";
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      setSignature(signature);
    }
    if (!signature && connected) {
      getSignature();
    }
  }, [publicKey]);

  useEffect(() => {
    async function userAuth() {
      let form = {
        publicKey: publicKey.toBase58(),
        signature: bs58.encode(signature),
      };
      console.log(form);
      const response = await axios.post(`${ENDPOINT}/user-auth`, form);
      localStorage.setItem("jwt-auth", response.data.token);
      window.location.reload();
    }
    const jwt = localStorage.getItem("jwt-auth");
    if (signature && !jwt) {
      userAuth();
    }
  }, [signature]);
  return (
    <div className="buttonlayout">
      <WalletMultiButton></WalletMultiButton>
    </div>
  );
};

export default WalletHandler;
