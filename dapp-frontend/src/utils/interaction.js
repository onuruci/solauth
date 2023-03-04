import { ethers } from "ethers";
import { decode as atob, encode as btoa } from "base-64";
import {
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { deserialize, serialize } from "borsh";
import * as Web3 from "@solana/web3.js";
import { base58 } from "ethers/lib/utils";

const RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";
const SVG_ABI = require("./SVGABI.json");

const svgAddress = "0xB19db005C446E59dE8726E06735C5e454956Cc89";

export var svgContract;

export var signer;
export var provider;
export var walletAddress;
export var signedMessage;

const network = "https://api.devnet.solana.com";
const connection = new Connection(network);



const programId= new PublicKey(
	"7gjKW9WJVqdJ2cBMAaHpiPePunZXjXCxzVyJvzcNJG95"
);


const isPhantomInstalled = window.phantom?.solana?.isPhantom;

const getProvider = () => {
  if ("phantom" in window) {
    const provider = window.phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }

  window.open("https://phantom.app/", "_blank");
};

export const connectWallet = async (publicKey, wallet) => {
  try {
    signer = publicKey;
    const message = "sign";
    const encodedMessage = new TextEncoder().encode(message);
    console.log(publicKey, wallet);
    signedMessage = await wallet.adapter.signMessage(encodedMessage);
    console.log(signedMessage);
  } catch (err) {
    console.error(err);
  }
};

export const getCurrentWalletConnected = async (setAdress) => {
  if (window.solana) {
    const provider = getProvider(); // see "Detecting the Provider"
    try {
      const resp = await provider.connect();
      console.log(resp.publicKey.toString());

      setAdress(resp.publicKey.toString());
      signer = resp.publicKey;
      const message = "sign";
      const encodedMessage = new TextEncoder().encode(message);
      signedMessage = await provider.signMessage(encodedMessage, "utf8");
    } catch (err) {
      // { code: 4001, message: 'User rejected the request.' }
    }
  } else {
    return {
      address: "",
      status: "Install Metamask",
    };
  }
};

export async function setPayerAndBlockhashTransaction(instructions) {
  const provider = getProvider();
  const resp = await provider.connect();

  const transaction = new Transaction();
  instructions.forEach((element) => {
    transaction.add(element);
  });
  transaction.feePayer = resp.publicKey;
  let hash = await connection.getRecentBlockhash();
  transaction.recentBlockhash = hash.blockhash;
  return transaction;
}

export async function signAndSendTransaction(transaction) {
  const provider = getProvider();
  const resp = await provider.connect();
  try {
    console.log("start signAndSendTransaction");
    let signedTrans = await provider.signTransaction(transaction);
    console.log("signed transaction");
    let signature = await connection.sendRawTransaction(
      signedTrans.serialize()
    );
    console.log("end signAndSendTransaction");
    return signature;
  } catch (err) {
    console.log("signAndSendTransaction error", err);
    throw err;
  }
}

class AbstractWallet {
  constructor(properties) {
    Object.keys(properties).forEach((key) => {
      this[key] = properties[key];
    });
  }
  static schema = new Map([
    [
      AbstractWallet,
      {
        kind: "struct",
        fields: [
          ["admin", [32]],
          ["description", "string"],
          ["warden1", [32]],
          ["warden2", [32]],
          ["warden3", [32]],
          ["balance", "u64"],
        ],
      },
    ],
  ]);
}

export async function createCampaign(publicKey) {
  const SEED = "abcdef" + Math.random().toString();
  let newAccount = await PublicKey.createWithSeed(publicKey, SEED, programId);

  let abstractWallet = new AbstractWallet({
    admin: publicKey.toBuffer(),
    description: "description",
    warden1: publicKey.toBuffer(),
    warden2: publicKey.toBuffer(),
    warden3: publicKey.toBuffer(),
    balance: 0,
  });

  let data = serialize(AbstractWallet.schema, abstractWallet);
  let data_to_send = new Uint8Array([0, ...data]);

  const lamports = await connection.getMinimumBalanceForRentExemption(
    data.length
  );

  const createProgramAccount = SystemProgram.createAccountWithSeed({
    fromPubkey: publicKey,
    basePubkey: publicKey,
    seed: SEED,
    newAccountPubkey: newAccount,
    lamports: lamports,
    space: data.length,
    programId: programId,
  });

  const instructionTOOurProgram = new TransactionInstruction({
    keys: [
      { pubkey: newAccount, isSigner: false, isWritable: true },
      { pubkey: publicKey, isSigner: true, isWritable: false },
    ],
    programId: programId,
    data: data_to_send,
  });

  const transact = await setPayerAndBlockhashTransaction([
    createProgramAccount,
    instructionTOOurProgram,
  ]);
  const signature = await signAndSendTransaction(transact);
  const result = await connection.confirmTransaction(signature);
  console.log("end sendMessage", result);
}

export async function getAllWallets(connection, adminAddress) {
  let accounts = await connection.getProgramAccounts(programId);
  let wallets = [];
  accounts.forEach((e) => {
    try {
      let campData = deserialize(
        AbstractWallet.schema,
        AbstractWallet,
        e.account.data
      );
      let accountAdminAddress = base58.encode(campData.admin);
      if (adminAddress.toString() === accountAdminAddress) {
        console.log("hello world");
        wallets.push({
          pubId: e.pubkey,
          description: campData.description,
          balance: campData.balance,
          admin: campData.admin,
          warden1: campData.warden1,
          warden2: campData.warden2,
          warden3: campData.warden3,
        });
      } else {
        console.log("not hello world");
      }
    } catch (err) {
      console.log(err);
    }
  });
  return wallets;
}

export const addLamports = async (address) => {
  const provider = getProvider();
  const resp = await provider.connect();
  const SEED = "Hello" + Math.random().toString();
  let newAccount = await PublicKey.createWithSeed(
    resp.publicKey,
    SEED,
    programId
  );

  const lamports = await connection.getMinimumBalanceForRentExemption(250);

  console.log("LAMPORTS:  ", lamports);
  console.log(address);

  const createDonationControlAccount = SystemProgram.createAccountWithSeed({
    fromPubkey: resp.publicKey,
    basePubkey: resp.publicKey,
    seed: SEED,
    newAccountPubkey: newAccount,
    lamports: 100000000,
    space: 10,
    programId: programId,
  });

  // const sendLamportsToPDA = SystemProgram.transfer({
  //   fromPubkey: wallet.publicKey,
  //   toPubkey: newAccount,
  //   lamports: 1000000,
  //   programId: programId,
  // });

  const instructionTOOurProgram = new TransactionInstruction({
    keys: [
      { pubkey: address, isSigner: false, isWritable: true },
      { pubkey: newAccount, isSigner: false, isWritable: true },
      { pubkey: resp.publicKey, isSigner: true },
    ],
    programId: programId,
    data: new Uint8Array([1, 1, 3, 4]),
  });

  const transaction_to_send = await setPayerAndBlockhashTransaction([
    createDonationControlAccount,
    instructionTOOurProgram,
  ]);

  const signature = await signAndSendTransaction(transaction_to_send);
  console.log("Signed");
  const result = await connection.confirmTransaction(signature);
  console.log("end sendMessage", result);
};

class WithdrawRequest {
  constructor(properties) {
    Object.keys(properties).forEach((key) => {
      this[key] = properties[key];
    });
  }
  static schema = new Map([
    [
      WithdrawRequest,
      {
        kind: "struct",
        fields: [["amount", "u64"]],
      },
    ],
  ]);
}

export const withdrawFunds = async (address) => {
  const provider = getProvider();
  const resp = await provider.connect();

  let withdrawRequest = new WithdrawRequest({ amount: 1000000 });
  let data = serialize(WithdrawRequest.schema, withdrawRequest);
  let data_to_send = new Uint8Array([4, ...data]);

  const instructionTOOurProgram = new TransactionInstruction({
    keys: [
      { pubkey: address, isSigner: false, isWritable: true },
      { pubkey: resp.publicKey, isSigner: true },
    ],
    programId: programId,
    data: data_to_send,
  });

  const transaction_to_send = await setPayerAndBlockhashTransaction([
    instructionTOOurProgram,
  ]);

  const signature = await signAndSendTransaction(transaction_to_send);
  console.log("Signed");
  const result = await connection.confirmTransaction(signature);
  console.log("end sendMessage", result);
};

/// Mint

export const mintNFT = async (_color) => {
  if (svgContract) {
    await svgContract.mint(_color);
  }
};

/// User NFT's

export const getNFTs = async (setArr, setIds) => {
  let balance = await svgContract.balanceOf(walletAddress);
  console.log("Balance:  ", balance);
  let arr = [];
  let indarr = [];

  for (let i = 0; i < balance; i++) {
    let ind = parseInt(await svgContract.tokenOfOwnerByIndex(walletAddress, i));
    indarr.push(ind);
    let uri = await svgContract.tokenURI(ind);
    let json = atob(uri.substring(29));
    let result = await JSON.parse(json);
    arr.push(result.image);
  }

  setArr([...arr]);
  setIds([...indarr]);
};

export const getURI = async (_id) => {
  let uri = await svgContract.tokenURI(_id);
  return uri;
};

/// Breed

export const breed = async (_id1, _id2) => {
  await svgContract.breed(_id1, _id2);
};

export const listenToBreedEvent = async (setSuccess, setWaiting, setNFT) => {
  if (svgContract) {
    svgContract.on("CustomMint", async (owner, id) => {
      if (owner.toString() == walletAddress) {
        let uri = await svgContract.tokenURI(parseInt(id));
        let json = atob(uri.substring(29));
        let result = await JSON.parse(json);
        setNFT(result.image);
        setSuccess(true);
        setWaiting(false);
      }
    });
  }
};

/// List

export const getAllNFTs = async (setArr) => {
  let total = await svgContract.totalSupply();
  let arr = [];
  for (let i = 0; i < total; i++) {
    let uri = await svgContract.tokenURI(i);
    let json = atob(uri.substring(29));
    let result = await JSON.parse(json);
    arr.push(result.image);
  }

  setArr([...arr]);
};
