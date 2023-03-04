import React, { useEffect, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { changeProgramOwner, getAllWardens } from "../../utils/interaction";
import {
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import bs58 from "bs58";

import { base58 } from "ethers/lib/utils";
import { PublicKey } from "@solana/web3.js";

const Wardenings = () => {
  const [wardenings, setWardenings] = useState([]);
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  useEffect(() => {
    async function getWardens() {
      const wds = await getAllWardens(connection, publicKey);
      setWardenings(wds);
    }
    getWardens();
  }, [publicKey]);
  async function handleChangeOwner(index) {
    const newOwner = document.getElementById(`new-owner-${index}`).value;
    console.log(newOwner);
    await changeProgramOwner(
      publicKey,
      wardenings[index].programAddress,
      bs58.decode(newOwner)
    );
    window.location.reload();
  }

  return (
    <section>
      <h1 className="text-xl font-semibold mx-auto text-center">
        My Wardenings
      </h1>
      <div className="flex flex-col gap-4">
        <List>
          {wardenings?.map((warden, index) => (
            <div className="py-6">
              <ListItem>
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Wallet Owner: ${warden?.publicKey}`}
                  secondary={`Wallet Address: ${warden?.programAddress.toString()}`}
                />
              </ListItem>
              <div className="flex flex-row gap-8 ml-[4.5rem]">
                <TextField
                  label="New Owner Address"
                  id={`new-owner-${index}`}
                />
                <Button
                  onClick={() => handleChangeOwner(index)}
                  variant="contained"
                >
                  Change Owner
                </Button>
              </div>
            </div>
          ))}
        </List>
      </div>
    </section>
  );
};

export default Wardenings;
