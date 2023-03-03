import React, { useEffect } from "react";
import { useState } from "react";
import "./styles.css";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import SwapVerticalCircleIcon from "@mui/icons-material/SwapVerticalCircle";

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
  calculateSwapOut,
  swaptokens,
} from "../../utils/interaction";

const Swap = () => {
  const [grfAllowance, setGRFAllowance] = useState(0);
  const [rhnAllowance, setRHNAllowance] = useState(0);
  const [grfReserve, setGRFReserve] = useState(0);
  const [rhnReserve, setRHNReserve] = useState(0);
  const [grfInput, setGRFInput] = useState(0);
  const [rhnInput, setRHNInput] = useState(0);

  const [swapState, setSwapState] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      getAllowance(grfContract, setGRFAllowance);
      getAllowance(rhnContract, setRHNAllowance);
      listenAllowanceEvent(setGRFAllowance, setRHNAllowance, setSuccessMessage);
      getReserves(setGRFReserve, setRHNReserve);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(false);
      }, 5000);
    }
  }, [successMessage]);

  const handleSwapChange = () => {
    setSwapState(!swapState);
  };

  const handleClick = (_contract) => {
    addAllowance(_contract);
  };

  const handleGRFChange = (e) => {
    var value = e.target.value;
    setGRFInput(value);
    calculateSwapOut(value, grfReserve, rhnReserve, setRHNInput);
  };

  const handleRHNChange = (e) => {
    var value = e.target.value;
    setRHNInput(value);
    calculateSwapOut(value, rhnReserve, grfReserve, setGRFInput);
  };

  const handleSwap = () => {
    if (swapState) {
      swaptokens(grfContract, grfInput);
    } else {
      swaptokens(rhnContract, rhnInput);
    }
  };

  return (
    <code className="introstyle">
      <div>
        First you need to add allowance if you dont have enough allowed tokens
      </div>
      <div>Your GRF Allowance: {grfAllowance}</div>
      <Button
        sx={{ margin: "auto", width: "300px" }}
        variant="contained"
        onClick={() => handleClick(grfContract)}
      >
        Allow GRF Tokens
      </Button>
      <div>Your RHN Allowance: {rhnAllowance}</div>
      <Button
        sx={{ margin: "auto", width: "300px" }}
        variant="contained"
        onClick={() => handleClick(rhnContract)}
      >
        Allow RHN Tokens
      </Button>
      {successMessage && (
        <Alert severity="success">Tokens Approved Successfully</Alert>
      )}
      <div>Swap Between Tokens</div>
      {swapState ? (
        <>
          <TextField
            id="outlined-number"
            label="GRF amount"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ margin: "auto", width: "300px" }}
            value={grfInput}
            onChange={(e) => handleGRFChange(e)}
          />
          <SwapVerticalCircleIcon
            sx={{ margin: "auto", cursor: "pointer" }}
            color="primary"
            onClick={() => handleSwapChange()}
          />
          <TextField
            id="outlined-number"
            label="RHN expected amount"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            disabled
            value={rhnInput}
            sx={{ margin: "auto", width: "300px" }}
          />
        </>
      ) : (
        <>
          <TextField
            id="outlined-number"
            label="RHN amount"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ margin: "auto", width: "300px" }}
            value={rhnInput}
            onChange={(e) => handleRHNChange(e)}
          />
          <SwapVerticalCircleIcon
            sx={{ margin: "auto", cursor: "pointer" }}
            color="primary"
            onClick={() => handleSwapChange()}
          />
          <TextField
            id="outlined-number"
            label="GRF expected amount"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            disabled
            value={grfInput}
            sx={{ margin: "auto", width: "300px" }}
          />
        </>
      )}
      <Button
        sx={{ margin: "auto", width: "300px" }}
        variant="contained"
        onClick={() => handleSwap()}
      >
        Swap
      </Button>
    </code>
  );
};

export default Swap;
