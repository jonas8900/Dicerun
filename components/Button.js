import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function Button({ children, clicks, setClicks }) {
    
    const [randomNumber, setRandomNumber] = useState(null);
    const [randomHorizontalChange, setRandomHorizontalChange] = useState(null);
    const [randomVerticalChange, setRandomVerticalChange] = useState(null);
    const [randomTextNumber, setRandomTextNumber] = useState(null);
    const randomText = [
        "nochmal", 
        "hupps zu schnell",
        "nächstes Mal!",
        "klicke hier",
        "komm schon...",
        "Diggah!??!",
        "klick mich schneller",
        "damn...",
        "jetzt.. vertrau mir",
        "nee doch nicht"
    ];
    const router = useRouter();

    useEffect(() => {
        const number = Math.floor(Math.random() * 10) + 1;
        setRandomNumber(number);
      }, []); 

    useEffect(() => {
        setRandomHorizontalChange(Math.floor(Math.random() * 40) + 1);
        setRandomVerticalChange(Math.floor(Math.random() * 100) + 1);
        setRandomTextNumber(Math.floor(Math.random() * 10));


        if(clicks == randomNumber && clicks !== null) {

                router.push("/greetings");
        }
    }, [clicks]);


    function handleCountClicks() {
        setClicks(clicks + 1);
    }



    return (
        <CenteredContainer randomHorizontalChange={randomHorizontalChange} clicks={clicks}>
        {clicks !== randomNumber &&(
            <CenteredButton
            randomHorizontalChange={randomHorizontalChange}
            randomVerticalChange={randomVerticalChange}
            clicks={clicks}
            onClick={handleCountClicks}
            >
            {clicks === 0 ? (
            children
            ) : (
            randomText[randomTextNumber]
            )}
            </CenteredButton>
        )}
      </CenteredContainer>
    );
  };


const CenteredButton = styled.button`
  background-color: #87CEEB; 
  color: white;
  font-size: 1.2rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
  position: ${({ clicks }) => clicks === 0 ? "static" : "absolute"};
  top: ${({ randomVerticalChange }) => `${randomVerticalChange}%`};
  right: ${({ randomHorizontalChange }) => `${randomHorizontalChange}%`};

  &:hover {
    background-color: #6CA6CD; 
  }

  &:active {
    background-color: #5C9ECD;
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f9fc;
`;