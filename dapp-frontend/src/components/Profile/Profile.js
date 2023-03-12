import React, { useState, useEffect, useReducer } from "react";

import {
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

import {
  handleUpdateUser,
  handleSignUp,
  checkUser,
  logInUser,
  getUser,
} from "./api/profile-api-calls";

import { ProfilePictureDropZone } from "./components/ProfilePictureUpload";
import { userReducer } from "./utils/user-reducer";

const Profile = () => {
  const { publicKey, connected, signMessage } = useWallet();
  const [editState, setEdit] = useState(false);
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [userExist, setUserExist] = useState(false);

  const [signInfo, signDispatch] = useReducer(userReducer, {
    name: "",
    mail: "",
    phone: "",
    profile_image: null,
  });

  const [editInfo, editDispatch] = useReducer(userReducer, {
    name: "",
    mail: "",
    phone: "",
    profile_image: null,
  });

  useEffect(() => {
    // create the preview
    let objectUrl;
    const url = editInfo.profile_image
      ? editInfo.profile_image
      : signInfo.profile_image;
    if (editInfo.profile_image || signInfo.profile_image) {
      objectUrl = URL.createObjectURL(url);
      setPreview(objectUrl);
    }

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [editInfo, signInfo]);

  useEffect(() => {
    console.log(user);
    if (user) {
      editDispatch({
        type: "load",
        nextUser: user,
      });
    }
  }, [user]);

  const handleSwitch = () => {
    setPreview(null);
    setEdit(!editState);
  };

  const handleLogOut = () => {
    localStorage.removeItem("jwt-solauth");
    window.location.reload();
  };

  useEffect(() => {
    // if user is not signed, render a button that allows user to sign.
    // User should not reach values withour signing messages
    const signMessageAndChechUser = async () => {
      if (connected) {
        checkUser(publicKey, setUserExist, signMessage);
      }
    };

    const getUserIfJWT = async () => {
      if (connected) {
        getUser(publicKey, setUser);
      }
    };

    signMessageAndChechUser();
    getUserIfJWT();
  }, [publicKey]);

  return user ? (
    <code className="introstyle">
      <h1 className="text-2xl font-semibold">Profile</h1>
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
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-4">
                <TextField
                  id="outlined-required"
                  label="Name"
                  defaultValue={user?.name}
                  type="text"
                  onChange={(e) =>
                    editDispatch({
                      type: "changed_name",
                      nextName: e.target.value,
                    })
                  }
                />
                <TextField
                  id="outlined-required"
                  label="Mail"
                  type="email"
                  defaultValue={user?.mail}
                  onChange={(e) =>
                    editDispatch({
                      type: "changed_mail",
                      nextMail: e.target.value,
                    })
                  }
                />
                <TextField
                  id="outlined-required"
                  label="Phone"
                  defaultValue={user?.phone}
                  type="tel"
                  onChange={(e) =>
                    editDispatch({
                      type: "changed_phone",
                      nextPhone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-8">
                <h1 className="text-lg font-semibold">
                  Upload Profile Image Below
                </h1>
                <ProfilePictureDropZone
                  dispatch={editDispatch}
                  preview={preview}
                />
              </div>
            </div>
          </Box>
          <div>
            <Button
              onClick={() => handleUpdateUser(editInfo, publicKey)}
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
        <>
          <div className="flex flex-row gap-4 items-center justify-between">
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
            <div className="flex flex-col items-center gap-6">
              <h1 className="text-xl font-semibold">Profile Picture</h1>
              <div
                className="w-48 h-48 rounded-full border-2 border-blue-500"
                style={{
                  backgroundImage: `url(${user.imageUrl})`,
                  backgroundPositionX: "center",
                  backgroundPositionY: "center",
                  backgroundSize: "200px auto",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </div>
          <Button
            type="submit"
            onClick={() => handleLogOut()}
            size="large"
            className="mt-80"
            variant="contained"
          >
            Log Out
          </Button>
        </>
      )}
    </code>
  ) : (
    <>
      {!userExist ? (
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
            <ProfilePictureDropZone dispatch={signDispatch} preview={preview} />
            <Button
              type="submit"
              onClick={() => handleSignUp(signInfo, publicKey, signMessage)}
              size="large"
              className="mt-80"
              variant="contained"
            >
              Sign to Solauth
            </Button>
          </FormControl>
        </div>
      ) : (
        <Button
          type="submit"
          onClick={() => logInUser(publicKey, setUser, signMessage)}
          size="large"
          className="mt-80"
          variant="contained"
        >
          Log In
        </Button>
      )}
    </>
  );
};

export default Profile;
