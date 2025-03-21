import TextButton from "@/components/Buttons/TextSubmitButton";
import Header from "@/components/Header/Header";
import CredentialInput from "@/components/Inputs/credentialInput";
import ToastDanger from "@/components/ToastMessages/Danger";
import ToastSuccess from "@/components/ToastMessages/Success";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR, { mutate } from "swr";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Managetasks() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { x } = router.query;
  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState('');

  const { data: gameData, error, isLoading } = useSWR(x ? `/api/game/getGameById?id=${x}` : null);

  if (status === "loading") {
    return <h1>Lade...</h1>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
  }

    
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const requestData = { ...data, x };

    const response = await fetch("/api/game/addGameTask", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      console.log("Question added");

      mutate(x ? `/api/game/getGameById?id=${x}` : null);
      event.target.reset();
      setToastMessage('Aufgabe erfolgreich Hinzugefügt! 🎉');
      setTimeout(() => {
        setToastMessage(''); 
      }, 3000);
    } else {
      setToastError(response.error);
        setTimeout(() => {
          setToastMessage("");
        }, 3000);
    }
  }

  async function handleDelete(taskId) {
    const response = await fetch(`/api/game/deleteGameTask`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId: x, taskId }),
    });

    if (response.ok) {
      console.log("Task deleted");
      mutate(x ? `/api/game/getGameById?id=${x}` : null); 
      setToastMessage('Aufgabe erfolgreich gelöscht! ❌');
      setTimeout(() => {
        setToastMessage(''); 
      }, 3000);
    } else {
      setToastError(response.error);
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }
  }

  return (
    <>
      {session && session.user && session.user.email && (
        <>
          <ToastSuccess message={toastMessage} onClose={() => setToastMessage('')} />
          <ToastDanger message={toastError} onClose={() => setToastError(null)}/>
          <Header headline={`Hey ${session.user.firstname}💖!`} path={"Neues Spiel"} />
          <Styledheadline></Styledheadline>
          <StyledLabel htmlFor="task" />
          <StyledIcon onClick={() => router.push(`/activeGame/${x}`)}/>
          <StyledParagraph>Neue Aufgabe erstellen</StyledParagraph>
          <StyledForm onSubmit={handleSubmit}>
            <CredentialInput type="text" name="task" placeholder="Aufgabe erstellen" maxLength="500" />
            <StyledTextButton type="submit" text={"Aufgabe erstellen"} />
          </StyledForm>
          <br />
          <hr />
          <StyledParagraph>Bisherige Aufgaben des Spiels:</StyledParagraph>

          {gameData && gameData.game && gameData.game.questions && gameData.game.questions.length > 0 ? (
            <StyledTable>
              <thead>
                <tr>
                  <th>Aufgabe</th>
                  <th>Aktion</th>
                </tr>
              </thead>
              <tbody>
                {gameData.game.questions.map((question, index) => (
                  <tr key={index}>
                    <td>{question.task}</td>
                    <td>
                      <StyledButton onClick={() => handleDelete(question._id)}>
                        Löschen
                      </StyledButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          ) : (
            <StyledParagraph>Es gibt noch keine Aufgaben in diesem Spiel.</StyledParagraph>
          )}
        </>
      )}
    </>
  );
}

const StyledTextButton = styled(TextButton)`
    background-color: var(--brand-primary);
`;


const StyledIcon = styled(IoMdArrowRoundBack)`
  width: 2rem;
  height: 2rem;
  margin-left: 2rem;
  cursor: pointer;
`;

const Styledheadline = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 0.2rem;
  color: var(--brand-primary);
  text-align: center;

`;

const StyledParagraph = styled.p`
  margin: 0.2rem 1.5rem; 
  padding: 1rem;
  font-size: 1rem;
  color: var(--brand-primary);
`;

const StyledLabel = styled.label`
  display: none;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem; 
  width: 80%;
  margin: auto;
`;

const StyledTable = styled.table`
  width: 80%;
  margin: 20px auto;
  border-collapse: collapse;
  text-align: left;

  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
  }
`;

const StyledButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;