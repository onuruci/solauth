import React from "react";

import { HeaderWrapper } from "./ScHeader";
import TabContainerHeader from "../TabContainerHeader";
import LogoContainer from "../LogoContainer";
import ConnectButton from "../ConnectButton";
import HamburgerMenu from "../HamburgerMenu";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

const Header = ({ logoImg }) => {
  return (
    <HeaderWrapper>
      <LogoContainer img={logoImg} />
      <WalletMultiButton  />
    </HeaderWrapper>
  );
};

export default Header;
