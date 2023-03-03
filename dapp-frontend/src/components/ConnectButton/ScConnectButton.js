import styled from "styled-components";

export const ButtonWrapper = styled.div`
  padding: 0.5rem;
`;

export const ButtonStyled = styled.div`
  padding: 0.2rem 3rem;
  border: solid 2px;
  display: flex;
  flex-direction: row;
  border-radius: 0.5rem;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  @media (max-width: 720px) {
    padding: 0rem 1.2rem;
    font-size: 16px;
  }
`;
