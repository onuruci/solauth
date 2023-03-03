import React from "react";
import { useState, useEffect } from "react";

import logo from "../../common/phantom-icon.png"

import { ButtonWrapper, ButtonStyled } from "./ScConnectButton";
import {
  signer,
  connectWallet,
  walletAddress,
  getCurrentWalletConnected,
} from "../../utils/interaction";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const ConnectButton = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getCurrentWalletConnected(setAdress);
  }, []);

  const [address, setAdress] = useState("");

  return (
    <ButtonWrapper>
      <ButtonStyled onClick={() => connectWallet(setAdress)}>
        <img
          style={{ height: "30px", maxWidth: "100%", padding:"5px" }}
          src={logo}
          alt=""
          srcset=""
        />
        <p>
          {address
            ? address.slice(0, 5) + "..." + address.slice(-2)
            : "Connect"}
        </p>
      </ButtonStyled>
    </ButtonWrapper>
  );
};

export default ConnectButton;
