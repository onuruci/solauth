import React from "react";

import "./styles.css";

const Introduction = () => {
  return (
    <code className="introstyle">
      <div>Interactive SVG NFT's running on Avalanche Fuji testnet</div>
      <div>
        Here we have three types of mintable DoGGo's, green, red and blue. You
        can mint them freely.
      </div>
      <div>
        Then using your NFT's you can breed new DoGGo's with secondary colors.
      </div>
      <div>
        Feel free to test the application and reach your feedback to me. If you
        have any fun ideas we can discuss and build together.
      </div>
      <div>Smart Contract Addresses </div>
      <code>
        <div>DoGGO NFT Smart Contract:</div>
        <div>
          <a
            target="_blank"
            href="https://testnet.snowtrace.io/address/0xB19db005C446E59dE8726E06735C5e454956Cc89#code"
          >
            <div>0xB19db00...56Cc89</div>
          </a>
        </div>
      </code>
      <div>Contact Me: uci.onur@gmail.com</div>
      <div>Onur</div>
    </code>
  );
};

export default Introduction;
