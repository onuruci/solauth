import React, { useRef } from "react";
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
import Stack from "@mui/material/Stack";
import { useConnection } from "@solana/wallet-adapter-react";
import * as Web3 from "@solana/web3.js";
import {
  createCampaign,
  getAllWallets,
  addLamports,
  withdrawFunds,
  changeWardens,
} from "../../utils/interaction";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { base58 } from "ethers/lib/utils";

const Wardens = () => {
  {
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();
    const [balance, setBalance] = useState(0);
    const [pdaAddress, setPdaAddress] = useState("");
    const warden1Ref = useRef();
    const warden2Ref = useRef();
    const warden3Ref = useRef();
    const withdrawAmount = useRef();
    const loadAmount = useRef();
    const [abstractWallet, setAbstractWallet] = useState(null);

    const handleAddLamports = async () => {
      const amount = loadAmount.current.value;
      await addLamports(pdaAddress, publicKey, amount);
      window.location.reload();
    };

    const handleWithdraw = async () => {
      const amount = withdrawAmount.current.value;
      await withdrawFunds(pdaAddress, publicKey, amount);
      window.location.reload();
    };

    const handleChangeWardens = async () => {
      await changeWardens(
        pdaAddress,
        bs58.decode(warden1Ref.current.value),
        bs58.decode(warden2Ref.current.value),
        bs58.decode(warden3Ref.current.value)
      );
      window.location.reload(true);
    };

    useEffect(() => {
      if (connected) {
        const getWalletsSetKey = async () => {
          let res = await getAllWallets(connection, publicKey);
          console.log("res: ", res);

          if (res.length > 0) {
            let wallet = res[0];
            setAbstractWallet(wallet);
            console.log("Balance:  ", wallet.balance.toString());
            setBalance(wallet.balance.toString());
            setPdaAddress(wallet.pubId);
          }
        };

        getWalletsSetKey();
      }
    }, [publicKey]);

    return (
      <code className="introstyle">
        <h2>Wallet of {publicKey?.toString()}</h2>
        {abstractWallet ? (
          <div>
            <div>Balance: {balance / Web3.LAMPORTS_PER_SOL} SOL</div>
            <div className="py-6 flex flex-col gap-8">
              <div className="flex flex-row gap-4">
                <TextField
                  id="outlined-required"
                  label="Load Amount"
                  inputRef={loadAmount}
                />
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => handleAddLamports()}
                >
                  Add Lamports
                </Button>
              </div>
              <div className="flex flex-row gap-4">
                <TextField
                  id="outlined-required"
                  label="Withdraw Amount"
                  inputRef={withdrawAmount}
                />
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => handleWithdraw()}
                >
                  withdrawFunds
                </Button>
              </div>
            </div>
            <div>
              <h1>My Wardens</h1>
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
                  <ListItemText
                    primary="Warden 1"
                    secondary={base58.encode(abstractWallet.warden1)}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Warden 2"
                    secondary={base58.encode(abstractWallet.warden2)}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <BeachAccessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Warden 3"
                    secondary={base58.encode(abstractWallet.warden3)}
                  />
                </ListItem>
              </List>
              <div>Change Wardens</div>
              <Stack
                spacing={3}
                sx={{
                  marginTop: "2rem",
                }}
              >
                <TextField
                  id="outlined-required"
                  label="New Warden1 Address"
                  defaultValue={base58.encode(abstractWallet.warden1)}
                  inputRef={warden1Ref}
                />
                <TextField
                  id="outlined-required"
                  label="New Warden2 Address"
                  defaultValue={base58.encode(abstractWallet.warden2)}
                  inputRef={warden2Ref}
                />
                <TextField
                  id="outlined-required"
                  label="New Warden3 Address"
                  defaultValue={base58.encode(abstractWallet.warden3)}
                  inputRef={warden3Ref}
                />
                <Button
                  variant="contained"
                  onClick={() => handleChangeWardens()}
                  type="submit"
                >
                  Change Wardens
                </Button>
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
