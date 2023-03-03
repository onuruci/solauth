import styled from 'styled-components'

export const HeaderWrapper = styled.div`
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem 2rem;
    height: 4.75rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    @media (max-width : 620px) {
      padding: 0.5rem 1rem
    }
`;