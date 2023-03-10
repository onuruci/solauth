import React from "react";
import { useState, useEffect, useContext, useMemo } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { HASH, ENDPOINT } from "./utils/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

const WalletHandler = ({ setCurrentProfile }) => {
  const { publicKey, connected, wallet, signMessage } = useWallet();

  async function getSignature() {
    const message = "sign";
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodedMessage);
    return signature;
  }

  useEffect(() => {
    async function userAuth() {
      const signature = await getSignature();
      let form = {
        publicKey: publicKey.toBase58(),
        signature: bs58.encode(signature),
      };

      const response = await axios.post(`${ENDPOINT}/user-auth`, form);
      console.log("response: ", response);
      localStorage.setItem(`jwt-${publicKey}`, response.data.token);
    }

    async function jwtVerify() {
      const config = {
        headers: { authorization: `Bearer ${jwt}` },
      };
      const response = await axios.get(`${ENDPOINT}/user-jwt-verify`, config);
      if (response.data.error === 1) {
        localStorage.removeItem("jwt-auth");
        return;
      }
      console.log("verify response: ", response);
      setCurrentProfile(response.data.authData.foundUser);
      console.log(response.data.authData.foundUser);
    }

    if (!connected) {
      return;
    }

    const jwt = localStorage.getItem(`jwt-${publicKey}`);
    console.log(jwt);

    // if JWT does not exist for that user, authenticate and save the jwt.
    if (!jwt) {
      userAuth();
    }

    // if jwt exists for that publickey then verify the jwt
    else {
      jwtVerify();
    }
  }, [publicKey]);

  return (
    <div className="buttonlayout">
      <WalletMultiButton>
        Login with Solauth
      </WalletMultiButton>
    </div>
  );
};

export default WalletHandler;
