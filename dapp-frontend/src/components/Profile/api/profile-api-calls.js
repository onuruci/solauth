import axios from "axios";
import bs58 from "bs58";
import ENDPOINT from "../../../utils/endpoint";

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
  let form = {
    publicKey: publicKey.toBase58(),
    ...editInfo,
  };
  await axios.post(ENDPOINT + "update-user", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  window.location.reload();
};

export async function checkUser(publicKey, setUser) {
  let response = await axios.get(`${ENDPOINT}user/${publicKey}`);
  // check if user already signed
  // if user is signed, just set user
  if (response.data.isExist) {
    console.log(response.data.user._doc);
    setUser({
      ...response.data.user._doc,
      imageUrl: response.data.user.imageUrl,
    });
  }
}
