import React from "react";

import { HeaderWrapper } from "./ScHeader";
import TabContainerHeader from "../TabContainerHeader";
import LogoContainer from "../LogoContainer";
import ConnectButton from "../ConnectButton";
import HamburgerMenu from "../HamburgerMenu";

const Header = ({ logoImg }) => {
  return (
    <HeaderWrapper>
      <LogoContainer img={logoImg} />
      <ConnectButton />
    </HeaderWrapper>
  );
};

export default Header;
