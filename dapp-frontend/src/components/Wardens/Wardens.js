import React from "react";
import { useState, useEffect } from "react";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { createCampaign, getAllWallets, signer, addLamports } from "../../utils/interaction";
import bs58 from 'bs58';


const Wardens = () => {{

  const [walletExist, setWalletExist] = useState(false);
  const [balance, setBalance] = useState(0);
  const [warden1, setWarden1] = useState("");
  const [warden2, setWarden2] = useState("");
  const [warden3, setWarden3] = useState("");
  const [pdaAddress, setPdaAddress] = useState("");

  const handleAddLamports = () => {
    addLamports(pdaAddress);
  };

  useEffect(() => {
    if(signer) {
      const getWalletsSetKey = async () => {
        let res = await getAllWallets();
        console.log(res);

        if(res.length > 0) {
          setWalletExist(true);
          let wallet = res[0];
          console.log("Balance:  ", wallet.balance.toString());
          setBalance(wallet.balance.toString());
          setWarden1(bs58.encode(wallet.warden1));
          setWarden2(bs58.encode(wallet.warden2));
          setWarden3(bs58.encode(wallet.warden3));
          setPdaAddress(wallet.pubId);
        }
      }
      
      getWalletsSetKey();
    }
  }, [signer]);

  return (
    <code className="introstyle">
      My Wallet
      {
        walletExist ? <div>
          <div>
        Balance: {balance} Lamports
        <button onClick={() => handleAddLamports()}> ADD Lamports</button>
      </div>
      <div>
        My Wardens
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
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
      <TextField
          id="outlined-required"
          label="New Warden Address"
          defaultValue=""
        />
      <Button variant="contained">Change</Button>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Warden 2" secondary={warden2} />
      </ListItem>
      <TextField
          id="outlined-required"
          label="New Warden Address"
          defaultValue=""
        />
      <Button variant="contained">Change</Button>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Warden 3" secondary={warden3} />
      </ListItem>
      <TextField
          id="outlined-required"
          label="New Warden Address"
          defaultValue=""
        />
      <Button variant="contained">Change</Button>
    </List>
      </div>
        </div> :
        <>
         <Button onClick={() => createCampaign()} sx={{
            width: '100%',
            marginTop: '2rem',
          }} variant="contained">Generate New Wallet</Button>
        </>
      }
     
      
    </code>
  );
}};

export default Wardens;