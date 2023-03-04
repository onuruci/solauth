import React from "react";
import { useState, useEffect } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import { useConnection } from "@solana/wallet-adapter-react";
import {
  createCampaign,
  getAllWallets,
  addLamports,
  withdrawFunds,
  changeWardens,
} from "../../utils/interaction";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";

const Wardens = () => {
  {
    const { connection } = useConnection();
    const [walletExist, setWalletExist] = useState(false);
    const [balance, setBalance] = useState(0);
    const [warden1, setWarden1] = useState("");
    const [warden2, setWarden2] = useState("");
    const [warden3, setWarden3] = useState("");
    const [pdaAddress, setPdaAddress] = useState("");
    const { publicKey, connected } = useWallet();

    const handleAddLamports = () => {
      addLamports(pdaAddress);
    };

    const handleWithdraw = () => {
      withdrawFunds(pdaAddress);
    };

    const handleChangeWardens = () => {
      changeWardens(pdaAddress, bs58.decode(warden1), bs58.decode(warden2), bs58.decode("Fmk8NjvEtxnStkUWdc1HakmXoH4HRjrFD79zK96C5a8X"));
    };

    useEffect(() => {
      if (connected) {
        const getWalletsSetKey = async () => {
          let res = await getAllWallets(connection, publicKey);
          console.log("res: ", res);

          if (res.length > 0) {
            setWalletExist(true);
            let wallet = res[0];
            console.log("Balance:  ", wallet.balance.toString());
            setBalance(wallet.balance.toString());
            setWarden1(bs58.encode(wallet.warden1));
            setWarden2(bs58.encode(wallet.warden2));
            setWarden3(bs58.encode(wallet.warden3));
            setPdaAddress(wallet.pubId);
          }
        };

        getWalletsSetKey();
      }
    }, [publicKey]);

    return (
      <code className="introstyle">
        My Wallet
        {walletExist ? (
          <div>
            <div>
              Balance: {balance} Lamports
              <Button variant="contained" onClick={() => handleAddLamports()}>
                Add Lamports
              </Button>
              <Button variant="contained" onClick={() => handleWithdraw()}>
                withdrawFunds
              </Button>
            </div>
            <div>
              My Wardens
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Warden 1" secondary={warden1} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Warden 2" secondary={warden2} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <BeachAccessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Warden 3" secondary={warden3} />
                </ListItem>
              </List>
              <div>
                Change Wardens
              </div>
              <Stack spacing={3} sx={{
                  marginTop: "2rem",
                }}>
                <TextField
                  id="outlined-required"
                  label="New Warden1 Address"
                  defaultValue={warden1}
                />
                <TextField
                  id="outlined-required"
                  label="New Warden2 Address"
                  defaultValue={warden2}
                />
                <TextField
                  id="outlined-required"
                  label="New Warden3 Address"
                  defaultValue={warden3}
                />
                <Button variant="contained" onClick={() => handleChangeWardens()}>Change Wardens</Button>
              </Stack>
            </div>
          </div>
        ) : (
          <>
            <Button
              onClick={() => createCampaign(publicKey)}
              sx={{
                width: "100%",
                marginTop: "2rem",
              }}
              variant="contained"
            >
              Generate New Wallet
            </Button>
          </>
        )}
      </code>
    );
  }
};

export default Wardens;
