import React from "react";

import { LogoWrapper, ImgStyled } from "./ScLogoContainer";

const LogoContainer = ({ img }) => {
  return (
    <LogoWrapper>
      <ImgStyled src={img} alt="" />
    </LogoWrapper>
  );
};

export default LogoContainer;
