import Button from '@/components/Button';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import styled, { keyframes } from 'styled-components';

export default function Greetings({  setClicks }) {

    const [randomImage, setRandomImage] = useState(1);
    const [randomSlogan, setRandomSlogan] = useState(null); 
    const [typingStatus, setTypingStatus] = useState('Initializing');
    const router = useRouter();

    const slogans = [
        "Ode an das Bier 🍺\nOh goldenes Elixier, so rein,\nIm Krug, im Glas, ein Funkelwein.\nDein Schaum wie Wolken, leicht und klar,\nEin Gruß der Götter, wunderbar.",
        "Man kann zwar 100% seines Geldes verlieren, aber man kann auch 1000% gewinnen, denke da mal drüber nach.. 🚬",
        "Ey, kann ich dir meinen neuen Song zeigen? 🎵",
        "Ich mache mir keine Sorgen darum, dass der Strom ausfällt, ich mache mir sorgen darum, dass das Bier leer wird und die Tank zu hat 🍺",
        "Bro ich hab ne geile Zeile pass auf: Was haben ein Esel, ein Pferd und ein Hund gemeinsam, ich steckte schon in allen drin, warte, die war falsch...",
        "Eigentlich bin ich ja gegen Propaganda, wenn Paganda aber Bier hat, bin ich Pro Paganda...",
        "Alerta, Alerta, Antibatista! 🚬",
        "Ich bin kein Alkoholiker, Alkohol ist Domeaniker 🍺",
        "Meine Bitch nennt mich nicht Daddy sondern Mutti, ähh, Deine Bitch! DEINE!!",
        "Ich jag mich hoch am Opernplatz da hat man dann für zwei Opern platz, nein das ist zu hart, das mach ich wieder weg..",
        "was haben ein Rabbi, ein Priester, ein Koch mit 3 Eiern Ein Flyerverteiler mit ei'm Paket FlyernEin Esel, zwei Geier, ich und 300 Freier gemeinsam? Könnten alle dein Vadder sein (Der Spruch ist unnormal scheiße Dome)",
        "Ich schnarche nicht, ich rotze den Tabak in der Nacht aus",
        "Dieser Spruch wird dich aufmuntern: 你真的翻譯出來了嗎.... Ich hab nicht gesagt, dass er Auf Deutsch ist 🙂",
        "Klopf Klopf, wer ist da?..... Anna... Anna Wer?... Anna Tür hat wer gekl..(Schussgeräusche)",
        "Aufgabe!: Trinke mit Dome einen kurzen, Dome gibt aus",
        "Aufgabe!: streichel Dome sanft durch seine Haare und sag ihm wie unfassbar süß sein kleines Vogelei ist.",
    ];

    useEffect(() => {
        const randomImage = Math.floor(Math.random() * 19) + 1;
        setRandomImage(randomImage);

        const randomSloganIndex = Math.floor(Math.random() * slogans.length);
        setRandomSlogan(randomSloganIndex);

    }, []); 

    function handleSwitchSide() {
        router.push('/');
        setClicks(null);
    }
  
    if (randomSlogan === null) {
        return null; 
    }


    return (
        <FadeInContainer>
            <StyledImageWrapper>
                <StyledImage src={`/images/${randomImage}.jpg`} alt="Bild" width={500} height={500} />
            </StyledImageWrapper>
            
            <TextWrapper>
                <TypeAnimation
                    sequence={[
                        1500,
                        () => {
                            setTypingStatus('Typing...');
                        },
                        slogans[randomSlogan], 
                        () => {
                            setTypingStatus('Done Typing');
                        },
                        1000,
                        () => {
                            setTypingStatus('Deleting...');
                        },
                        '',
                        () => {
                            setTypingStatus('Done Deleting');
                        },
                    ]}
                    repeat={Infinity}
                />
            </TextWrapper>
            <StyledTypingStatus>Status: <span>{typingStatus}</span></StyledTypingStatus>
            <StyledButton onClick={handleSwitchSide}>Noch eine Weisheit</StyledButton>
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
