import styled from 'styled-components';

export const TabContainernWrapper = styled.div`
    display: flex;
    flex-direction: row;
    padding: 1rem 2rem;
    align-items: center;

    @media (max-width : 1200px) {
      display: none;
    }
`;

export const TabWrapper = styled.div`
    margin: 0 1rem 0 1rem;
    padding: 1rem 1rem;
`;

export const TabStyled = styled.a`
    text-decoration: none;
    color: black;
`;