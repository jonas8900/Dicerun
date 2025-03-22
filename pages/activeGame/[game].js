import TextButton from "@/components/Buttons/TextSubmitButton";
import Header from "@/components/Header/Header";
import ToastSuccess from "@/components/ToastMessages/Success";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import useSWR, { mutate } from "swr";
import Greetings from "@/components/Game/GamePreview";
import NavigationBar from "@/components/Navigation/NavigationBar";
import Game from "@/components/Game/GamePreview";
import ToastDanger from "@/components/ToastMessages/Danger";

export default function GameStart({setClicks, clicks}) {
    const router = useRouter();
    const { game } = router.query;
    const { data: gameData, error, isLoading } = useSWR(game ? `/api/game/getGameById?id=${game}` : null);
    const { data: session, status } = useSession();
    const [selectedActions, setSelectedActions] = useState({});
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    let isAdmin = false;


    if (isLoading || status === 'loading') {
      return <h1>Lade...</h1>;
    }
  
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }

    if(gameData) {
      isAdmin = gameData?.game?.admin?.includes(session?.user?.id);
    }


    function handleActionChange(player) {
      return (event) => {
        setSelectedActions({ ...selectedActions, [player]: event.target.value });
      };
    }
    
    async function handleConfirm(player) {

        const action = selectedActions[player];
        if (action) {
          if(action === 'admin') {
            fetch('/api/game/addAdminToGame', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ player, game: gameData.game._id })
            });
          } else if(action === 'remove') {
            fetch('/api/game/deletePlayerFromGame', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ player, game: gameData.game._id })
            });
              
          mutate(game ? `/api/game/getGameById?id=${game}` : null);
          setToastMessage(`${action} wurde auf Person ${player.firstname} ${player.lastname} ausgeführt! 🎉`);
          setTimeout(() => {
            setToastMessage(''); 
          }, 3000);
        }
      };

  }

    async function handleCreateInviteLink() {
      let DateNow = new Date();
      const dateToTime = DateNow.getTime();
      const dateNowToString = dateToTime.toString();

      const inviteLink = `${window.location.origin}/joingame?x=${gameData.game._id}&creationtime=${dateNowToString}`;

      if(inviteLink) {
        const response = await fetch('/api/game/createInvite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inviteLink, game: gameData.game._id })
        });


        if(response.ok) {
            setToastMessage('der Einladungslink wurde erfolgreich in deinen Zwischenablagen kopiert! 🎉');
            navigator.clipboard.writeText(inviteLink);
            setTimeout(() => {
              setToastMessage(''); 
            }, 3000);
        } else {
          console.error('Fehler beim Erstellen des Einladungslinks');
          setToastError(response.error);
          setTimeout(() => {
            setToastMessage("");
          }, 3000);
          return;
        }
      }

    }


    function handleNeedQuestionsToStart() {
      if(gameData.game.questions.length === 0) {
        setToastError('Es müssen mindestens 1 Frage erstellt werden, um das Spiel zu starten!');
        setTimeout(() => {
          setToastError(null);
        }, 3000);
      }
    }

    console.log(gameData.game.answeredQuestions)

    return(
        <>
        {isAdmin && !gameStarted ? (
          <>
          <ToastSuccess message={toastMessage} onClose={() => setToastMessage('')} />
          <ToastDanger message={toastError} onClose={() => setToastError(null)}/>
          <Header headline={`Hey ${session.user.firstname}💖!`} path={gameData.game.name}/>
          <StyledLabel htmlFor="newgame" />
          <StyledParagraph>Hey {session.user.firstname} du bist der Admin des Spiels <b>{gameData.game.name}</b>. Hier im Adminbereich kannst du Fragen anlegen, Spieler entfernen, einladen oder zum Admin befördern. <br></br><br></br>
          Diesen Bereich können nur diejenigen sehen, die ebenfalls Admin sind von diesem Spiel.
          </StyledParagraph>
          <StyledButtonContainer>
            <TextButton text="Aufgaben verwalten" onClick={() => router.push(`/managetasks?x=${game}`)} />
              {gameData.game.questions.length > 0 ? (
                <TextButton text="Spielstart" onClick={() => setGameStarted(true)} />
              ) : (
                <TextButton text="Spielstart" onClick={handleNeedQuestionsToStart} />
              )}
            
            <TextButton text="Einladung generieren" onClick={handleCreateInviteLink} />
          </StyledButtonContainer>
          <Table>
            <thead>
              <tr>
                <Th>Spieler</Th>
                <Th>Aktion</Th>
                <Th>Bestätigen</Th>
              </tr>
            </thead>
            <tbody>
              {gameData.players.map((player) => (
                <tr key={player._id}>
                  <Td>{player.firstname} {player.lastname} {gameData.game.admin.includes(player._id) && ' 👑'}</Td>
                  <Td>
                    <Select onChange={handleActionChange(player)}>
                      <option value="">Aktion wählen</option>
                      <option value="admin">Zum Admin befördern</option>
                      {gameData.game.players.length > 1 && !gameData?.game?.admin?.includes(player._id) && (
                          <option value="remove">Entfernen</option>
                      )}

                    </Select>
                  </Td>
                  <Td>
                    <Button onClick={() => handleConfirm(player)}>Bestätigen</Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br></br>
          <hr></hr>
          <StyledParagraph>Statistik des Spieles:</StyledParagraph>
          <Table>
            <thead>
              <tr>
                <Th>Spieler</Th>
                <Th>Erledigte Aufgaben</Th>
                <Th>Punkte</Th>
              </tr>
            </thead>
            <tbody>
              {gameData.players.map((player) => (
                <tr key={player._id}>
                  <Td>{player.firstname} {player.lastname}</Td>
                  <Td>
                    {gameData.game.answeredQuestions.find((entry) => entry.player === player._id)?.questions.length || 0} <br></br><StyledPointsParagraph>Gesamt: {gameData.game.answeredQuestions.find((entry) => entry.player === player._id)?.questions.reduce((acc, curr) => acc + curr.count, 0) || 0} mit Wiederholungen</StyledPointsParagraph>
                  </Td>
                  <Td>
                    {gameData.game.scores.find((score) => score.player === player._id)?.points || 0}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br></br>
          <br></br>
          </>
          ) :(
          <>
          <NavigationBarConatiner>
            <NavigationBar />
          </NavigationBarConatiner>
          {gameData ? (
            <Game/>
          ) : (
            <h1>Kein Spiel gefunden</h1>
          )}
          </>
          )}
        </>
    )
}


const NavigationBarConatiner = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
`;

const StyledParagraph = styled.p`
  margin: 1.5rem; 
  padding: 0.5rem;
  font-size: 1rem;
  color: var(--brand-primary);
`;

const StyledLabel = styled.label`
  display: none;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;

  button {
    padding: 0.5rem;
    max-width: 6rem;

  }
`;

const StyledPointsParagraph = styled.p`
  font-size: 0.6rem;
  color: var(--brand-primary);
  margin: 0;
  padding: 0;
`;

const Table = styled.table`
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;


`;

const Th = styled.th`
  background: #333;
  color: white;
  padding: 8px;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ccc;
`;


const Select = styled.select`
    max-width: 30rem;
    width: 120px;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    border: 1px solid  #BCBCBC;
    background: #FFF;

`;


const Button = styled.button`
  	display: flex;
    height: 2rem;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    border-radius: 0.375rem;
    border: none;
    background: #5C9ECD;
    font-family: 'Roboto', sans-serif;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover, &:active {
    background-color: var(--brand-secondary);
  }
`;