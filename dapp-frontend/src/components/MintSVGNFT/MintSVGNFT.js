import React from "react";
import { useState, useEffect } from "react";

import Button from "@mui/material/Button";

import { mintNFT, signer } from "../../utils/interaction";

import d_green from "../../common/dog_green.svg";
import d_red from "../../common/dog_red.svg";
import d_blue from "../../common/dog_blue.svg";

const MintSVGNFT = () => {
  return(
    <code className="introstyle">
      <div>
        Mint your DoGGo NFT
      </div>

      <div className="dogimage">
        <img  src={d_red} alt="" srcset="" className="dogimage"/>
        <Button
        sx={{ margin: "auto", width:"200px" }}
        variant="contained"
        onClick={() => mintNFT(0)}
      >
        Mint Red
      </Button>
      </div>

      <div className="dogimage">
        <img  src={d_green} alt="" srcset="" className="dogimage"/>
        <Button
        sx={{ margin: "auto", width:"200px" }}
        variant="contained"
        onClick={() => mintNFT(1)}
      >
        Mint Green
      </Button>
      </div>

      <div className="dogimage">
        <img  src={d_blue} alt="" srcset="" className="dogimage"/>
        <Button
        sx={{ margin: "auto", width:"200px" }}
        variant="contained"
        onClick={() => mintNFT(2)}
      >
        Mint Blue
      </Button>
      </div>
      
    </code>
  );
};

export default MintSVGNFT;
