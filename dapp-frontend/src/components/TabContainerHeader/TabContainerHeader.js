import React from "react";

import { TabContainernWrapper, TabWrapper, TabStyled } from "./ScTabContainerHeader";

const TabContainerHeader = () => {
    return(
        <TabContainernWrapper>
            <TabWrapper>
                <TabStyled href="http://" target="_blank" rel="noopener noreferrer">Home</TabStyled>
            </TabWrapper>
            <TabWrapper>
                <TabStyled href="http://" target="_blank" rel="noopener noreferrer">Mint</TabStyled>
            </TabWrapper>
            <TabWrapper>
                <TabStyled href="http://" target="_blank" rel="noopener noreferrer">Roadmap</TabStyled>
            </TabWrapper>
            <TabWrapper>
                <TabStyled href="http://" target="_blank" rel="noopener noreferrer">Team</TabStyled>
            </TabWrapper>
        </TabContainernWrapper>
    );
};

export default TabContainerHeader;