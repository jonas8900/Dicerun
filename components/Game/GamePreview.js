import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { TypeAnimation } from 'react-type-animation';
import styled, { keyframes } from 'styled-components';
import useSWR from 'swr';
import { mutate } from "swr";
import ToastSuccess from '../ToastMessages/Success';
import ToastDanger from '../ToastMessages/Danger';

export default function Game() {
    const router = useRouter();
    const { game } = router.query;
    const { data, isLoading } = useSWR("/api/game/getGameTasks?x=" + game);
    const { data: gameData, error, isLoading: gameLoading } = useSWR(
        game ? `/api/game/getGameById?id=${game}` : null,
        {
            revalidateOnMount: true,   
            revalidateOnFocus: true,  
            revalidateOnReconnect: true,
        }
    );
    const { data: session, status } = useSession();
    const [randomImage, setRandomImage] = useState(1);
    const [randomSlogan, setRandomSlogan] = useState(null); 
    const [typingStatus, setTypingStatus] = useState('Initializing');
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState('');
    const [reloader, setReloader] = useState(false);




    // useEffect(() => {
    //     const randomImage = Math.floor(Math.random() * 19) + 1;
    //     setRandomImage(randomImage);

    //     if (data && data.questions.length > 0) {
    //         const randomSloganIndex = Math.floor(Math.random() * data.questions.length);
    //         setRandomSlogan(data.questions[randomSloganIndex].task);
    //     }
    // }, [data]); 

    useEffect(() => {
       
        if (!gameLoading && gameData && data) {
            handleSetRandomQuestion();
        }
    }, [gameLoading, gameData, data]);

    const reloadGameData = useCallback(async () => {
        await mutate(`/api/game/getGameById?id=${game}`, undefined, true);
        console.log('reloaded');
        console.log(gameData?.game?.answeredQuestions?.length);
    }, [game]); 
    
        useEffect(() => {
            if (reloader) { 
                reloadGameData();
                setReloader(false); 
            }
    }, [reloader, reloadGameData]);
    

    // useEffect(() => {
    //     if (data && data.questions.length > 0 && gameData && gameData.game) {
    //         const game = gameData.game;  
    //         const answeredQuestions = game.answeredQuestions || [];  
    
    //         console.log(answeredQuestions, 'answeredQuestions');

    //         const playerAnsweredQuestions = answeredQuestions.find(
    //             (entry) => entry.player.toString() === session?.user.id 
    //         );
    
    //         console.log(playerAnsweredQuestions, 'playerAnsweredQuestions'); 
    

    //         const remainingQuestions = playerAnsweredQuestions
    //             ? data.questions.filter(
    //                 (question) => !playerAnsweredQuestions.questions.includes(question._id)
    //             )
    //             : data.questions; 

    //             console.log(remainingQuestions, 'remainingQuestions');
    
    //         if (remainingQuestions.length > 0) {
    //             const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    //             setRandomSlogan(remainingQuestions[randomIndex].task);
    //         } else {
    //             setRandomSlogan(data.questions[Math.floor(Math.random() * data.questions.length)].task);
    //         }
    //     }
    // }, [data, gameData, session, reloader]);

    async function handleSetRandomQuestion() {
        if (!gameData || !gameData.game) {
            const response = await fetch(`/api/game/getGameById?id=${game}`);
            
            if(response.ok) {
                const newGameData = await response.json();
                mutate(`/api/game/getGameById?id=${game}`, newGameData, { revalidate: true });
            } else {
                console.error('Fehler beim Laden des Spiels');
                return;
            }

        }
        

        if (data && data.questions.length > 0 && gameData && gameData.game) {
            const game = gameData.game;  


            const answeredQuestions = game.answeredQuestions || [];  


            const playerAnsweredQuestions = answeredQuestions.find(
                (entry) => entry.player.toString() === session?.user.id 
            );
    


            const remainingQuestions = playerAnsweredQuestions
            ? data.questions.filter((question) => {
                return !playerAnsweredQuestions.questions.some(
                    (answeredQuestion) => answeredQuestion.taskId.toString() === question._id.toString()
                );
            })
            : data.questions;
    
            if (remainingQuestions.length > 0) {
                const randomImage = Math.floor(Math.random() * 19) + 1;
                setRandomImage(randomImage);

                const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
                setRandomSlogan(remainingQuestions[randomIndex].task);
            } else {
                setRandomSlogan(data.questions[Math.floor(Math.random() * data.questions.length)].task);
            }
        }
    }
    
      
    
    
      
    
    async function handleSwitchSide() {
        await mutate(`/api/game/getGameTasks?x=${game}`, null, { revalidate: true });
    }
    

    if (isLoading || randomSlogan === null || !data) {
        return <div>Lade Daten...</div>; 
    }


    async function handleTaskSuccess() {
            const task = data.questions.find(q => q.task === randomSlogan); 
            const currentUser = session?.user; 
            const points = task?.points;
            const pointsAfterFinish = task?.pointsAfterFinish;

          
            if (points && currentUser) {
              const response = await fetch('/api/game/addPoints', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameId: game, playerId: currentUser.id, points, fail: false, taskId: task._id, pointsAfterFinish }),
              });

              if (response.ok) {
                const answerResponse = await fetch(`/api/game/addAnsweredTasks`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ gameId: game, playerId: currentUser.id, taskId: task._id }),
                });
                if (answerResponse.ok) {
                    await mutate(`/api/game/getGameTasks?x=${game}`, null, { revalidate: true });
                    handleSetRandomQuestion(); 
                    setReloader(!reloader); 
                    setToastMessage('Punkte erfolgreich hinzugefügt! 🎉');
                    setTimeout(() => setToastMessage(''), 3000);
                  }
                } else {
                  console.error('Fehler beim Hinzufügen der Punkte');
                }
              }
            }

    async function handleTaskFail() {
        const task = data.questions.find(q => q.task === randomSlogan); 
        const currentUser = session?.user; 
        const points = task?.points;
        const pointsAfterFinish = task?.pointsAfterFinsih;
      
        if (points && currentUser) {
          const response = await fetch('/api/game/addPoints', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameId: game, playerId: currentUser.id, points, fail: true, taskId: task._id, pointsAfterFinish }),
          });
      
          if (response.ok) {
            const answerResponse = await fetch(`/api/game/addAnsweredTasks`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ gameId: game, playerId: currentUser.id, taskId: task._id }),
            });
            
            if (answerResponse.ok) {
                await mutate(`/api/game/getGameTasks?x=${game}`, null, { revalidate: true });
                handleSetRandomQuestion();
                setReloader(!reloader); 
                setToastMessage('Punkte erfolgreich hinzugefügt! 🎉');
                setTimeout(() => setToastMessage(''), 3000);
              }
            } else {
              console.error('Fehler beim Hinzufügen der Punkte');
            }
          }
        }

    return (
        <FadeInContainer>
            <ToastSuccess message={toastMessage} onClose={() => setToastMessage('')} />
            <ToastDanger message={toastError} onClose={() => setToastError(null)}/>
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
                            "Aufgabe: "+randomSlogan,  
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
            <StyledButtonContainer>
                <StyledSuccessButton onClick={handleTaskSuccess}>Erfüllt</StyledSuccessButton>
                <StyledDangerButton onClick={handleTaskFail}>Nicht erfüllt</StyledDangerButton>
            </StyledButtonContainer>
            <StyledButton onClick={handleSwitchSide}>Nächste Aufgabe</StyledButton>
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

const StyledIcon = styled(IoMdArrowRoundBack)`
  width: 2rem;
  height: 2rem;
  top: 1.5rem;
  left: 1.5rem;
  position: absolute;
  cursor: pointer;
`;

const StyledButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0;
`;

const StyledSuccessButton = styled.button`
    background-color:rgb(135, 235, 140);
    color:rgb(255, 255, 255);
    font-size: 1.2rem;
    padding: 10px 20px;
    margin-bottom: 1rem;
    border: none;
    border-radius: 5px;
    width: 8rem;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    `;

    const StyledDangerButton = styled.button`
    background-color:rgb(235, 135, 135);
    color:rgb(255, 255, 255);
    font-size: 1.2rem;
    padding: 10px 20px;
    margin-bottom: 1rem;
    border: none;
    border-radius: 5px;
    width: 8rem;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    `;

const StyledImage = styled(Image)`
    width: 100%; 
    height: 100%; 
    max-height: 250px;
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
    margin-top: 1rem;
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
    margin: 0 2rem 0 2rem;
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
