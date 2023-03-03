import React from "react";
import { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import { signer, signedMessage } from "../../utils/interaction";
import bs58 from 'bs58';
import ENDPOINT from "../../utils/endpoint";

import axios from 'axios';


const Profile = () => {
  const [editState, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSwitch = () => {
    setEdit(!editState);
  };

  const handleChangeSubmit = async () => {
    if(signedMessage) {
      let form = {
        'publicKey': signer.toBase58(),
        'signature': bs58.encode(signedMessage.signature),
        'name': "Onur Y",
        'mail': "onurmail",
        'phone': "myphone",
      }
      await axios.post(ENDPOINT+"update-user", form);
    }

    
  }

  useEffect(() => {
    if(signedMessage) {
      const signUser = async () => {
        console.log("Signer:  ", signer.toBase58());
        console.log(bs58.encode(signedMessage.signature));

        let form = {
          'publicKey': signer.toBase58(),
          'signature': bs58.encode(signedMessage.signature),
        }

        let res = await axios.post(ENDPOINT+"sign-to-auth", form);
        console.log(res.data);
        setName(res.data.newUser.name);
        setMail(res.data.newUser.mail);
        setPhone(res.data.newUser.phone);
      }

      signUser();
      
    }
  }, [signer, signedMessage]);

  return (
    <code className="introstyle">
      Profile
      <div>
        <FormControlLabel control={<Switch onChange={() => handleSwitch()} />} label="Edit Profile" />
      </div>
      {
        editState ? 
        <div>
         <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '20ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-required"
            label="Name"
            defaultValue={name}
          />
          <TextField
            id="outlined-required"
            label="Mail"
            defaultValue={mail}
          />
          <TextField
            id="outlined-required"
            label="Phone"
            defaultValue={phone}
          />
        </Box>
        <div>
          <Button onClick={()=> handleChangeSubmit()} sx={{
            width: '100%',
            marginTop: '2rem',
          }} variant="contained">Save Changes</Button>
        </div>
      </div> 
      : 
      <div>
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
        <ListItemText primary="Name" secondary={name} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Mail" secondary={mail} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Phone" secondary={phone} />
      </ListItem>
    </List>
      </div>
      }
      
    </code>
  );
};

export default Profile;