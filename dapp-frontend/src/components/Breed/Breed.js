import React from "react";
import { useState, useEffect } from "react";

import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import {
  signer,
  walletAddress,
  getNFTs,
  getURI,
  breed,
  listenToBreedEvent,
} from "../../utils/interaction";

const Breed = () => {
  const [userNFTs, setUserNFTs] = useState([]);
  const [nftIds, setNftIds] = useState([]);
  const [firstNFT, setFirstNFT] = useState("");
  const [secondNFT, setSecondNFT] = useState("");
  const [firstNFTId, setFirstNFTId] = useState(-1);
  const [secondNFTId, setSecondNFTId] = useState(-1);
  const [dots, setDots] = useState("...");
  const [mintingState, setMintingState] = useState(false);
  const [successMessage, setSuccess] = useState(false);
  const [newNFT, setNewNFT] = useState("");

  useEffect(() => {
    if (walletAddress) {
      getNFTs(setUserNFTs, setNftIds);
      listenToBreedEvent(setSuccess, setMintingState, setNewNFT);
    }
  }, [walletAddress]);

  useEffect(() => {
    setTimeout(() => {
      if (dots.length === 3) {
        setDots(".");
      } else {
        setDots(dots + ".");
      }
    }, 800);
  }, [dots]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        getNFTs(setUserNFTs, setNftIds);
        setSuccess(false);
        setNewNFT("");
      }, 10000);
    }
  }, [successMessage]);

  const handleClick = (i) => {
    if (!firstNFT) {
      setFirstNFT(userNFTs[i]);
      setFirstNFTId(nftIds[i]);
    } else {
      setSecondNFT(userNFTs[i]);
      setSecondNFTId(nftIds[i]);
    }
  };

  const handleBreed = () => {
    if (firstNFTId >= 0 && secondNFTId >= 0) {
      breed(firstNFTId, secondNFTId);
      setMintingState(true);
    }
  };

  const handleClear = () => {
    setFirstNFT("");
    setSecondNFT("");
    setFirstNFTId(-1);
    setSecondNFTId(-2);
  };

  return (
    <code className="introstyle">
      <div>Breed new DoGGo</div>
      <Stack direction="row" spacing={3} sx={{ margin: "auto" }}>
        {firstNFT ? (
          <img className="doglistimage" src={firstNFT} />
        ) : (
          <Skeleton
            variant="circular"
            width={120}
            height={120}
            animation={false}
          />
        )}
        {secondNFT ? (
          <img className="doglistimage" src={secondNFT} />
        ) : (
          <Skeleton
            variant="circular"
            width={120}
            height={120}
            animation={false}
          />
        )}
      </Stack>
      <Button
        sx={{ margin: "auto", width: "250px" }}
        variant="contained"
        onClick={() => handleBreed()}
      >
        Breed
      </Button>
      <Button
        sx={{ margin: "auto", width: "250px" }}
        variant="contained"
        onClick={() => handleClear()}
      >
        Clear selection
      </Button>
      <div>New DoGGo</div>

      {mintingState && <div>Wait a while. Minting {dots}</div>}

      {newNFT ? (
        <Stack direction="row" spacing={3} sx={{ margin: "auto" }}>
          <img className="doglistimage" src={newNFT} />
        </Stack>
      ) : (
        <Stack direction="row" spacing={3} sx={{ margin: "auto" }}>
          <Skeleton variant="circular" width={120} height={120} />
        </Stack>
      )}

      {successMessage && <Alert severity="success">Successfully Minted</Alert>}

      <div>Select two of your DoGGO's</div>
      <div>It takes some time loading your NFT's</div>
      {userNFTs.length === 0 ? (
        <div className="doglist">
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="circular" width={120} height={120} />
        </div>
      ) : (
        <div className="doglist">
          {userNFTs.map((e, i) => {
            return (
              <div onClick={() => handleClick(i)}>
                <img className="doglistimage" src={e} />
              </div>
            );
          })}
        </div>
      )}
    </code>
  );
};

export default Breed;
