import React from "react";
import { useState, useEffect } from "react";
import "./styles.css";

import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import {
  walletAddress,
  dexContract,
  getGRFBalance,
  getRHNBalance,
  grfContract,
  rhnContract,
  getFaucetTokens,
  faucetListen,
} from "../../utils/interaction";

const Faucet = () => {
  const [grfBalance, setGRFBalance] = useState(0);
  const [rhnBalance, setRHNBalance] = useState(0);

  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      getGRFBalance(walletAddress, setGRFBalance);
      getRHNBalance(walletAddress, setRHNBalance);
      faucetListen(grfContract, handleFaucetEvent);
      faucetListen(rhnContract, handleFaucetEvent);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(false);
      }, 5000);
    }
  }, [successMessage]);

  const handleClick = (_contract, _setTokens) => {
    getFaucetTokens(_contract, _setTokens);
  };

  const handleFaucetEvent = () => {
    setSuccessMessage(true);
  };

  return (
    <code className="introstyle">
      <div>Faucet</div>
      <div>GRF Token</div>
      <div>Your GRF Balance: {grfBalance}</div>
      <Button
        sx={{ margin: "auto", width: "300px" }}
        variant="contained"
        onClick={() => handleClick(grfContract)}
      >
        Get 100 Token
      </Button>
      <div>RHN Token</div>
      <div>Your RHN Balance: {rhnBalance}</div>
      <Button
        sx={{ margin: "auto", width: "300px" }}
        variant="contained"
        onClick={() => handleClick(rhnContract)}
      >
        Get 100 Token
      </Button>
      {successMessage && (
        <Alert severity="success">Faucet successfully functioned refresh</Alert>
      )}
    </code>
  );
};

export default Faucet;

/// add value change on event
