import React from "react";
import { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import {
  walletAddress,
  dexContract,
  getGRFBalance,
  getRHNBalance,
  grfContract,
  rhnContract,
  getAllowance,
  addAllowance,
  listenAllowanceEvent,
  getReserves,
  getTotalShares,
  getUserShares,
  addLiq,
  calculateLiqGRFAmount,
  calculateLiqRHNAmount,
} from "../../utils/interaction";

const Liquidity = () => {
  const [totalShares, setTotalShares] = useState(0);
  const [userShares, setUserShares] = useState(0);
  const [grfReserve, setGRFReserve] = useState(0);
  const [rhnReserve, setRHNReserve] = useState(0);

  const [grfInput, setGRFInput] = useState(0);
  const [rhnInput, setRHNInput] = useState(0);

  useEffect(() => {
    if (walletAddress) {
      getReserves(setGRFReserve, setRHNReserve);
      getTotalShares(setTotalShares);
      getUserShares(setUserShares);
    }
  }, [walletAddress]);

  const handleGRFInputChange = (e) => {
    setGRFInput(e.target.value);
    if (grfReserve === "0.0" || rhnReserve === "0.0") {
      setRHNInput(e.target.value);
    } else {
      calculateLiqGRFAmount(e.target.value, setRHNInput);
    }
  };

  const handleRHNInputChange = (e) => {
    setRHNInput(e.target.value);
    if (rhnReserve === "0.0" || grfReserve === "0.0") {
      setGRFInput(e.target.value);
    } else {
      calculateLiqGRFAmount(e.target.value, setGRFInput);
    }
  };

  return (
    <code className="introstyle">
      <div>Menage Liquidity</div>
      <div>
        If you didn't give allowance to dex for tokens yet. Go to the swap page
        and allow dex to manage your tokens first.
      </div>
      <div>Total shares: {totalShares}</div>
      <div>Your shares: {userShares}</div>
      <div>Reserve GRF: {grfReserve}</div>
      <div>Reserve RHN: {rhnReserve}</div>
      <div>Send Tokens and Add Liquidity</div>
      <TextField
        id="outlined-number"
        label="GRF amount"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ margin: "auto", width: "200px" }}
        value={grfInput}
        onChange={(e) => handleGRFInputChange(e)}
      />
      <TextField
        id="outlined-number"
        label="RHN amount"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ margin: "auto", width: "200px" }}
        value={rhnInput}
        onChange={(e) => handleGRFInputChange(e)}
      />
      <Button
        sx={{ margin: "auto", width: "200px" }}
        variant="contained"
        onClick={() => addLiq(grfInput, rhnInput)}
      >
        Add Liquidity
      </Button>
      <div>Burn your shares & Gain interest</div>
      <Button sx={{ margin: "auto", width: "200px" }} variant="contained">
        Remove Liquidity
      </Button>
    </code>
  );
};

export default Liquidity;
