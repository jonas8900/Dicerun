import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import styled, { keyframes } from 'styled-components';
import useSWR from 'swr';
import { mutate } from "swr";

export default function Greetings({ gameId }) {
    const { data, isLoading } = useSWR("/api/getQuestion");
    const [randomImage, setRandomImage] = useState(1);
    const [randomSlogan, setRandomSlogan] = useState(null); 
    const [typingStatus, setTypingStatus] = useState('Initializing');
    const router = useRouter();

    useEffect(() => {
        const randomImage = Math.floor(Math.random() * 19) + 1;
        setRandomImage(randomImage);

        if (data && data.length > 0) {
            const randomSloganIndex = Math.floor(Math.random() * data.length);
            setRandomSlogan(data[randomSloganIndex]);
        }
    }, [data]); 

    
    async function handleSwitchSide() {
        await mutate("/api/getGameQuestions", null, { revalidate: true });
    }
    

    if (isLoading || randomSlogan === null || !data) {
        return <div>Lade Daten...</div>; 
    }


    return (
        <FadeInContainer>
            <StyledImageWrapper>
                <StyledImage src={`/images/${randomImage}.jpg`} alt="Bild" width={500} height={500} />
            </StyledImageWrapper>

            <TextWrapper>
               
                {randomSlogan && (
                    <TypeAnimation
                        sequence={[
                            1500,
                            () => {
                                setTypingStatus('Typing...');
                            },
                            randomSlogan.question,  
                            () => {
                                setTypingStatus('Done Typing');
                            }
                        ]}
                        speed={50} 
                        cursor={true} 
                        repeat={0} 
                    />
                )}
            </TextWrapper>
            <StyledTypingStatus>Status: <span>{typingStatus}</span></StyledTypingStatus>
            <StyledButton onClick={handleSwitchSide}>Neue Aufgabe</StyledButton>
        </FadeInContainer>
    );
}
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;


const FadeInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f9fc; 
  animation: ${fadeIn} 1s ease;

`;

const StyledImage = styled(Image)`
    width: 100%; 
    height: 100%; 
    max-height: 400px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledImageWrapper = styled.div`
    margin: 1rem 4rem 1rem 4rem;
    border-radius: 10px;
`;

const StyledTypingStatus = styled.p`  
    font-size: 1.2rem;
    margin-top: 2rem;
    margin-left: 4rem;
    font-weight: 600;
    color: #333;
    justify-self: flex-start;
    align-self: flex-start;

    span {
        color:rgb(205, 108, 108);
    }
`;

const TextWrapper = styled.div`
    margin: 0 4rem 0 4rem;
`;

const StyledButton = styled.button`
  background-color: #87CEEB; 
  color: white;
  font-size: 1.2rem;
  padding: 10px 20px;
  margin-bottom: 4rem;
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
