import React, { useMemo, useRef, useState, useEffect, useReducer } from "react";

import {
  Input,
  InputLabel,
  FormHelperText,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  FormControlLabel,
  Box,
  TextField,
  Switch,
} from "@mui/material";

import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import ENDPOINT from "../../utils/endpoint";

import axios from "axios";
import { color } from "@mui/system";

function signInfoReducer(state, action) {
  switch (action.type) {
    case "changed_name": {
      return {
        ...state,
        name: action.nextName,
      };
    }
    case "changed_mail": {
      return {
        ...state,
        mail: action.nextMail,
      };
    }
    case "changed_phone": {
      return {
        ...state,
        phone: action.nextPhone,
      };
    }
  }
  throw Error("Unknown action: " + action.type);
}

const Profile = () => {
  const { publicKey, connected, wallet, signMessage } = useWallet();
  const [editState, setEdit] = useState(false);
  const [user, setUser] = useState(null);
  const [signInfo, signDispatch] = useReducer(signInfoReducer, {
    name: "",
    mail: "",
    phone: "",
  });

  const nameInputRef = useRef();
  const mailInputRef = useRef();
  const phoneInputRef = useRef();

  const handleSwitch = () => {
    setEdit(!editState);
  };

  useEffect(() => {
    async function checkUser() {
      let response = await axios.get(`${ENDPOINT}${publicKey}`);
      // check if user already signed
      // if user is signed, just set user
      if (response.data.isExist) {
        setUser(response.data.user);
      }
      // if user is not signed, render a button that allows user to sign.
    }
    if (connected) {
      checkUser();
    }
  }, [publicKey]);

  async function handleSignUp() {
    const message = "sign";
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodedMessage);

    let form = {
      publicKey: publicKey.toBase58(),
      signature: bs58.encode(signature),
      ...signInfo,
    };
    let res = await axios.post(ENDPOINT + "sign-to-auth", form);
    console.log(res.data);
  }

  const handleChangeSubmit = async () => {
    const message = "sign";
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodedMessage);

    if (signature) {
      let form = {
        publicKey: publicKey.toBase58(),
        signature: bs58.encode(signature),
        name: nameInputRef.current.value,
        mail: mailInputRef.current.value,
        phone: phoneInputRef.current.value,
      };
      await axios.post(ENDPOINT + "update-user", form);
    }
    setEdit(false);
  };

  return user ? (
    <code className="introstyle">
      Profile
      <div>
        <FormControlLabel
          control={<Switch onChange={() => handleSwitch()} />}
          label="Edit Profile"
          checked={editState}
        />
      </div>
      {editState ? (
        <div>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "20ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-required"
              label="Name"
              defaultValue={user?.name}
              inputRef={nameInputRef}
              type="text"
            />
            <TextField
              id="outlined-required"
              label="Mail"
              inputRef={mailInputRef}
              type="email"
              defaultValue={user?.mail}
            />
            <TextField
              id="outlined-required"
              label="Phone"
              defaultValue={user?.phone}
              inputRef={phoneInputRef}
              type="tel"
            />
          </Box>
          <div>
            <Button
              onClick={() => handleChangeSubmit()}
              sx={{
                width: "100%",
                marginTop: "2rem",
              }}
              variant="contained"
            >
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div>
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
              <ListItemText primary="Name" secondary={user?.name} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <WorkIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Mail" secondary={user?.mail} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <BeachAccessIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Phone" secondary={user?.phone} />
            </ListItem>
          </List>
        </div>
      )}
    </code>
  ) : (
    <div className="flex flex-row items-center justify-center">
      <FormControl className="flex flex-col gap-4">
        <TextField
          onChange={(e) =>
            signDispatch({
              type: "changed_name",
              nextName: e.target.value,
            })
          }
          id="sign-name"
          label="Name"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            signDispatch({
              type: "changed_mail",
              nextMail: e.target.value,
            })
          }
          id="sign-mail"
          label="Mail"
          variant="outlined"
        />
        <TextField
          onChange={(e) =>
            signDispatch({
              type: "changed_phone",
              nextPhone: e.target.value,
            })
          }
          id="sign-phone"
          label="Phone"
          variant="outlined"
        />
        <Button
          type="submit"
          onClick={handleSignUp}
          size="large"
          className="mt-80"
          variant="contained"
        >
          Sign to Solauth
        </Button>
      </FormControl>
    </div>
  );
};

export default Profile;
