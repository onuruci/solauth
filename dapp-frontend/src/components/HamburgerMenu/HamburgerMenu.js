import React from "react";
import { useState, useEffect } from "react";

import { MenuWrapper, IconStyled, IconWrapper, MenuItemsContainer, LinkWrapper } from "./ScHamburgerMenu";
import menuIcon from '../../common/icons-menu.svg';
import closeIcon from '../../common/icons-close.svg';

const HamburgerMenu = () => {

    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleOpenMenu = () => {
        toggleMenu();  
    };

    const handleCloseMenu = () => {
        toggleMenu();
    };

    return(
        <MenuWrapper>
            {menuOpen === true ? 
            <div>
                <IconWrapper onClick={() => toggleMenu()} style={{zIndex: '15'}}>
                    <IconStyled src={closeIcon} alt="" srcset="" />
                </IconWrapper>
                <MenuItemsContainer>
                    <LinkWrapper>Home</LinkWrapper>
                    <LinkWrapper>Mint</LinkWrapper>
                    <LinkWrapper>RoadMap</LinkWrapper>
                    <LinkWrapper>Team</LinkWrapper>
                </MenuItemsContainer>
            </div> 
            : 
            <div>
                <IconWrapper onClick={() => toggleMenu()}>
                    <IconStyled src={menuIcon} alt="" srcset="" />
                </IconWrapper>
            </div>
            }
        </MenuWrapper>
    );
};

export default HamburgerMenu;