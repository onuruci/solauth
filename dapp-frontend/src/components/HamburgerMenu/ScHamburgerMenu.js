import styled from 'styled-components'

export const MenuWrapper = styled.div`
    display: none;
    @media (max-width : 720px) {
      display: block;
    }
`;

export const IconWrapper = styled.div`
    cursor: pointer;
    position: relative;
    z-index: 5;
`;

export const IconStyled = styled.img`
    max-width: 30px;
    z-index: 5;
`;

export const MenuItemsContainer = styled.div`
    position: absolute;
    width: 60%;
    background-color: rgba(59,130,246);
    top: 4rem;
    left: 0;
    left: auto;
    right: auto;
    z-index: 1;
    padding: 1rem 1rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
`;

export const LinkWrapper = styled.div`
    margin-left: auto;
    margin-right: auto;
    font-size: 24px;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

export const LinkStyled = styled.a``;