import React from "react";

import "./styles.css";

const Introduction = () => {
  return (
    <code className="introstyle">
      <div>
        A Basic Constant Multiplier AMM Implementation runs on Avalanche Fuji
        testnet.
      </div>
      <div>
        Here we have two tokens GRF and RHN tokens. From the faucet tab you can
        take some.
      </div>
      <div>
        Then on the exchange tab first you need to give allowance to the
        exchange for managing your tokens.
      </div>
      <div>
        After that you can exchange tokens, add liquidity, remove liquidty and
        gain interest.
      </div>
      <div>Smart Contract Addresses </div>
      <code>
        GRF Token Contract:
        <a
          target="_blank"
          href="https://testnet.snowtrace.io/address/0xfbf56915c81c9faF9998acff68B7a69f9ae0489a#code"
        >
          0xfbf56915c81c9faF9998acff68B7a69f9ae0489a
        </a>
      </code>
      <code>
        RHN Contract:
        <a
          target="_blank"
          href="https://testnet.snowtrace.io/address/0xCFDa65C828Ea8bEa5b1813cC4729d7C5a21dfFe9#code"
        >
          0xCFDa65C828Ea8bEa5b1813cC4729d7C5a21dfFe9
        </a>
      </code>
      <code>
        DEX Contract:
        <a
          target="_blank"
          href="https://testnet.snowtrace.io/address/0xd241dF67ED7488D100e1f658c08A42A7a5B8bc92#code"
        >
          0xb9A48DC50Ca240D42F634a4C2a517B5D30cE11BE
        </a>
      </code>
      <div>Contact Me: uci.onur@gmail.com</div>
      <div>Onur</div>
    </code>
  );
};

export default Introduction;
