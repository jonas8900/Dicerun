import Image from "next/image";
import NavigationBar from "../Navigation/NavigationBar";
import styled from "styled-components";
import { useRouter } from "next/router";

export default function Header({headline, path}) {



    return (
        <StyledContainer>
            <StyledImage src="/images/logo.png" alt="Logo" width={300} height={300} />
            <h1>{headline}</h1>
            <StyledNavigationBar/>
            <StyledLocation>{path}</StyledLocation>
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    display: grid; 
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr 0.2fr; 

    h1 {
        grid-area: 2 / 1 / 3 / 2;
        font-size: 1.2rem;
        color:rgb(15, 15, 15);
        text-align: center;
    }

    border-bottom: 1px solid rgb(150, 150, 150);
    padding: 1rem;
`;

const StyledImage = styled(Image)`
    grid-area: 1 / 1 / 2 / 2;
    width: 100%;
    height: 100%;
`;

const StyledNavigationBar = styled(NavigationBar)`
    grid-area: 1 / 2 / 2 / 3;

    justify-self: end;
`;

const StyledLocation = styled.p`
    grid-area: 2 / 2 / 3 / 3;
    justify-self: end;
    font-size: 1.2rem;
    color:rgb(15, 15, 15);
   
`;