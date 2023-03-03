import React from "react";

import "./styles.css"

const Introduction = () => {
  return(
    <div className="introstyle">
      <div>A Basic Token Vendor</div>
      <div>Here we have a REVO Token contract and each token is worth 0.1 Avax on Fuji testnet. Go check it out and buy some tokens with Fuji-Avax</div>
      <div>Smart Contract Addresses </div>
      <div>REVO Token Contract:  <a target="_blank" href="https://testnet.snowtrace.io/address/0xa6E3f2eD1b7bc000d8B775475508d08Cb4DC6453#code">0xa6E3f2eD1b7bc000d8B775475508d08Cb4DC6453</a></div>
      <div>Vendor Contract:   <a target="_blank" href="https://testnet.snowtrace.io/address/0x9d702AeC5817d9AC174c2A9e843a06194172d0Fa#code">0x9d702AeC5817d9AC174c2A9e843a06194172d0Fa</a></div>
      <div>Contact Me: uci.onur@gmail.com</div>
      <div>Onur</div>
    </div>
  );
};

export default Introduction;
