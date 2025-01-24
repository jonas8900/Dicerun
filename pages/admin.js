import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function Admin() {
    const router = useRouter();

    function handleSideChange() {
        router.push("/questions");
    }



    return (
        <StyledWrapper>
            <StyledHeadline>Das ist der Adminbereich</StyledHeadline>
            <Image src="/images/qrcode.png" width={300} height={300} alt="qrcode"></Image>
            <StyledButton onClick={handleSideChange}>Fragen anlegen</StyledButton>
        </StyledWrapper>
    )
}

const StyledHeadline = styled.h1`
    font-size: 1.6rem;
    font-weight: bold;
`;

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const StyledButton = styled.button`
 background-color: #87CEEB; 
  color: white;
  font-size: 1.2rem;
  padding: 10px 20px;
  margin-top: 3rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #6CA6CD; 
  }

  &:active {
    background-color: #5C9ECD;
  }
`;
