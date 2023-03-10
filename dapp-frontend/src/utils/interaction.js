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

export var svgContract;

const network = "https://api.devnet.solana.com";
const connection = new Connection(network);

const programId = new PublicKey("2pt1iULn3KBsPqJ2NXg75xWSbj8awft3HFGK72VT8hUK");

const getProvider = () => {
  if ("phantom" in window) {
    const provider = window.phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }

  window.open("https://phantom.app/", "_blank");
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

export async function getAllWardens(connection, publicKey) {
  if (!connection || !publicKey) {
    return;
  }
  let accounts = await connection.getProgramAccounts(programId);
  let wardenings = [];

  function isWarden(warden1, warden2, warden3) {
    warden1 = base58.encode(warden1);
    warden2 = base58.encode(warden2);
    warden3 = base58.encode(warden3);
    const strp = publicKey.toString();
    return warden1 === strp || warden2 === strp || warden3 === strp;
  }
  accounts.forEach((program) => {
    try {
      let userData = deserialize(
        AbstractWallet.schema,
        AbstractWallet,
        program.account.data
      );
      if (isWarden(userData.warden1, userData.warden2, userData.warden3)) {
        wardenings.push({
          publicKey: base58.encode(userData.admin),
          pubId: program.pubkey,
        });
      }
    } catch (e) {
      console.error("get all wardens error: ", e);
    }
  });
  return wardenings;
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
        wallets.push({
          pubId: e.pubkey,
          description: campData.description,
          balance: campData.balance,
          admin: campData.admin,
          warden1: campData.warden1,
          warden2: campData.warden2,
          warden3: campData.warden3,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
  return wallets;
}

export const addLamports = async (programAddress, publicKey, amount) => {
  const SEED = "Hello" + Math.random().toString();
  let newAccount = await PublicKey.createWithSeed(publicKey, SEED, programId);

  const lamports = await connection.getMinimumBalanceForRentExemption(250);

  const createDonationControlAccount = SystemProgram.createAccountWithSeed({
    fromPubkey: publicKey,
    basePubkey: publicKey,
    seed: SEED,
    newAccountPubkey: newAccount,
    lamports: amount * Web3.LAMPORTS_PER_SOL,
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
      { pubkey: programAddress, isSigner: false, isWritable: true },
      { pubkey: newAccount, isSigner: false, isWritable: true },
      { pubkey: publicKey, isSigner: true },
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

export const withdrawFunds = async (programAddress, publicKey, amount) => {
  let withdrawRequest = new WithdrawRequest({
    amount: amount * Web3.LAMPORTS_PER_SOL,
  });
  let data = serialize(WithdrawRequest.schema, withdrawRequest);
  let data_to_send = new Uint8Array([4, ...data]);

  const instructionTOOurProgram = new TransactionInstruction({
    keys: [
      { pubkey: programAddress, isSigner: false, isWritable: true },
      { pubkey: publicKey, isSigner: true },
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

export const changeProgramOwner = async (
  publicKey,
  programAddress,
  newOwner
) => {
  let requestObject = new AdminChangeRequest({ newowner: newOwner });
  let data = serialize(AdminChangeRequest.schema, requestObject);
  let data_to_send = new Uint8Array([3, ...data]);

  const instructionToOurProgram = new TransactionInstruction({
    keys: [
      { pubkey: programAddress, isSigner: false, isWritable: true },
      { pubkey: publicKey, isSigner: true },
    ],
    programId: programId,
    data: data_to_send,
  });
  const transaction_to_send = await setPayerAndBlockhashTransaction([
    instructionToOurProgram,
  ]);

  const signature = await signAndSendTransaction(transaction_to_send);
  console.log("Signed changeProgramOwner");
  const result = await connection.confirmTransaction(signature);
  console.log("confirmed: ", result);
};

export const changeWardens = async (address, warden1, warden2, warden3) => {
  const provider = getProvider();
  const resp = await provider.connect();

  let wardenChangeRequest = new WardenChangeRequest({
    warden1: warden1,
    warden2: warden2,
    warden3: warden3,
  });
  let data = serialize(WardenChangeRequest.schema, wardenChangeRequest);
  let data_to_send = new Uint8Array([2, ...data]);

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

class WardenChangeRequest {
  constructor(properties) {
    Object.keys(properties).forEach((key) => {
      this[key] = properties[key];
    });
  }
  static schema = new Map([
    [
      WardenChangeRequest,
      {
        kind: "struct",
        fields: [
          ["warden1", [32]],
          ["warden2", [32]],
          ["warden3", [32]],
        ],
      },
    ],
  ]);
}

class AdminChangeRequest {
  constructor(properties) {
    Object.keys(properties).forEach((key) => {
      this[key] = properties[key];
    });
  }
  static schema = new Map([
    [
      AdminChangeRequest,
      {
        kind: "struct",
        fields: [["newowner", [32]]],
      },
    ],
  ]);
}
