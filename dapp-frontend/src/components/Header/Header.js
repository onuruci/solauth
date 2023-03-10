import React from "react";

import { HeaderWrapper } from "./ScHeader";
import LogoContainer from "../LogoContainer";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

const Header = ({ logoImg }) => {
  return (
    <HeaderWrapper>
      <LogoContainer img={logoImg} />
      <WalletMultiButton />
    </HeaderWrapper>
  );
};

export default Header;
