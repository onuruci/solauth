import React from "react";
import { useState, useEffect } from "react";

import "./styles.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import { walletAddress,getBalance, getVendorBalance, getVendorAvaxBalance, buyTokens, tokenBuyListen } from "../../utils/interaction";

const Vendor = () => {
  const [valueInserted, setValueInserted] = useState(0);
  const [balance, setBalance] = useState(0);
  const [vendorBalance, setVendorBalance] = useState(0);
  const [vendorAvaxBalance, setVendorAvaxBalance] = useState(0);
  const [boughtAmount, setBoughtAmount] = useState(0);

  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    getBalance(setBalance);
    getVendorBalance(setVendorBalance);
    getVendorAvaxBalance(setVendorAvaxBalance);
    tokenBuyListen(handleBought);
  }, [walletAddress, successMessage]);

  useEffect(() => {
    if(successMessage) {
      setTimeout(() => {
        setSuccessMessage(false);
      }, 10000);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    if(e.target.value >= 0) {
      setValueInserted(e.target.value);
    }
  };

  const handleClick = () => {
    buyTokens(valueInserted);
  };

  const handleBought = (amount) => {
    setBoughtAmount(amount);
    setSuccessMessage(true);
  };

  return(
    <div className="introstyle">
      <div>
        REVO Tokens for 0.1 Fuji Avax
      </div>
      <div>
        Your REVO Balance:  {balance}
      </div>
      <div>
        Vendor REVO Balance: {vendorBalance}
      </div>
      <div>
        Vendor Avax Balance: {vendorAvaxBalance}
      </div>
       <TextField
          id="outlined-number"
          label="REVO amount"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={valueInserted}
          onChange={e => handleChange(e)}
          sx={{margin:"auto", width:"300px"}}
        />
        <div style={{margin:"auto", width:"300px"}}>
          Cost without gas: {valueInserted / 10} Avax
        </div>
      <Button onClick={() => handleClick()} sx={{margin:"auto", width:"300px"}} variant="contained">Buy</Button>
      {
        successMessage && <Alert severity="success">Tokens successfully bought {boughtAmount}</Alert>
      }
    </div>
  );
};

export default Vendor;

