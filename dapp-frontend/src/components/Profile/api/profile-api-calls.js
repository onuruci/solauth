import axios from "axios";
import bs58 from "bs58";
import ENDPOINT from "../../../utils/endpoint";

// This is for generating new user
export async function handleSignUp(signInfo, publicKey, signMessage) {
  const message = "sign";
  const encodedMessage = new TextEncoder().encode(message);
  const signature = await signMessage(encodedMessage);

  let form = {
    publicKey: publicKey.toBase58(),
    signature: bs58.encode(signature),
    ...signInfo,
  };
  let res = await axios.post(ENDPOINT + "sign-to-auth", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  window.location.reload();
}

export const handleUpdateUser = async (editInfo, publicKey) => {
  console.log("edit info: ", editInfo);
   const jwt  = localStorage.getItem("jwt-solauth");
  console.log("JWT:  ", jwt);
  const config = {
    headers: { "Content-Type": "multipart/form-data",
    authorization: `Bearer ${jwt}` }
  };
  let form = {
    publicKey: publicKey.toBase58(),
    ...editInfo,
  };
  await axios.post(ENDPOINT + "update-user", form, config);
  window.location.reload();
};

// This is for loging user to system
export async function logInUser(publicKey, setUser, signMessage) {
  const message = "sign";
  const encodedMessage = new TextEncoder().encode(message);
  const signature = await signMessage(encodedMessage);

  let response = await axios.post(`${ENDPOINT}user-auth/`, {
    publicKey: publicKey.toBase58(),
    signature: bs58.encode(signature),
  });

  localStorage.setItem("jwt-solauth", response.data.token);

  setUser({
    ...response.data.user._doc,
    imageUrl: response.data.user.imageUrl,
  });
}

export async function checkUser(publicKey, setUserFound) {
  let response = await axios.post(`${ENDPOINT}check-user/`, {
    publicKey: publicKey,
  });

  // check if user already signed
  // if user is signed, just set user
  if (response.data.isExist) {
    setUserFound(true);
    // setUser({
    //   ...response.data.user._doc,
    //   imageUrl: response.data.user.imageUrl,
    // });
  }
}

export async function getUser(publicKey, setUser) {
  const jwt = localStorage.getItem("jwt-solauth");
  console.log("JWT:  ", jwt);
  const config = {
    headers: { authorization: `Bearer ${jwt}` },
  };

  let response = await axios.post(
    `${ENDPOINT}user/`,
    {
      publicKey: publicKey,
    },
    config
  );

  if (response.data.isExist) {
    console.log(response.data.user._doc);
    setUser({
      ...response.data.user._doc,
      imageUrl: response.data.user.imageUrl,
    });
  }
}
