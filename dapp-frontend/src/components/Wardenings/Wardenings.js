import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAllWardens } from "../../utils/interaction";
import {
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";

import StepIcon from "@mui/material";

const Wardenings = () => {
  const [wardenings, setWardenings] = useState([]);
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  useEffect(() => {
    async function getWardens() {
      const wds = await getAllWardens(connection, publicKey);
      console.log("wds", wds);
      setWardenings(wds);
    }
    getWardens();
  }, [publicKey]);
  return (
    <section>
      <h1 className="text-xl font-semibold mx-auto text-center">
        My Wardenings
      </h1>
      <div className="flex flex-col gap-4">
        <List dense={true}>
          {wardenings?.map((warden) => (
            <ListItem>
              <ListItemAvatar>
                <Avatar></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Public Key: ${warden?.publicKey}`}
                secondary={`Abstract Wallet Address: ${warden?.programAddress.toString()}`}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </section>
  );
};

export default Wardenings;
