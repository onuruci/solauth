# SolAuth

SolAuth is an authentication service that allows external web applications to authenticate with their wallets.
Moreover, it provides a one-place sign in platform that eases the pain of signing in every time you visit a new website. Last but not the least, it provides a abstract wallet that you can send and withdraw money. Most importantly, if you were to lose your private key, your wardens you select while signing up to our service can change the admin of your abstract wallet and save your money!


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install solauth. It will be available in the future, we are working on the documentations.

```bash
npm install solauth
```

## Usage

```javascript

import React from "react";
import { useState, useEffect, useContext, useMemo } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";

# Your endpoint and the sign hash that you choose. 
# Sign hash is important because it does not display your private key.
import { HASH, ENDPOINT } from "./utils/constants";
import { useWallet } from "@solana/wallet-adapter-react";

# encoder to change string to base58, necessary for the backend, will be changed in the future
import bs58 from "bs58";


# Basic wallet handler with solana wallet adapter
const WalletHandler = () => {
  const { publicKey, connected, wallet, signMessage } = useWallet();
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    async function getSignature() {
      const message = "sign";
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      setSignature(signature);
    }
    if (!signature && connected) {
      getSignature();
    }
  }, [publicKey]);

  useEffect(() => {
    async function userAuth() {
      let form = {
        publicKey: publicKey.toBase58(),
        signature: bs58.encode(signature),
      };
      console.log(form);
      const response = await axios.post(`${ENDPOINT}/user-auth`, form);
      localStorage.setItem("jwt-auth", response.data.token);
      window.location.reload();
    }
    const jwt = localStorage.getItem("jwt-auth");
    if (signature && !jwt) {
      userAuth();
    }
  }, [signature]);
  return (
    <div className="buttonlayout">
      <WalletMultiButton></WalletMultiButton>
    </div>
  );
};

export default WalletHandler;

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)