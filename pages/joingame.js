import TextButton from "@/components/Buttons/TextSubmitButton";
import Header from "@/components/Header/Header";
import CredentialInput from "@/components/Inputs/credentialInput";
import ToastDanger from "@/components/ToastMessages/Danger";
import ToastSuccess from "@/components/ToastMessages/Success";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

export default function JoinGame() {
  const { data: session, status } = useSession();
  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState('');
  const router = useRouter();
  if (status === "loading") {
    return <h1>Lade...</h1>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
  }


  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());


    const response = await fetch('/api/game/getGameByInviteLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });


    if(!response.ok) {
      setToastError(response.error);
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
      return;
    }

    if(response.ok) {
      const gameData = await response.json();
      console.log(gameData);
      setToastMessage('Erfolgreich registriert! 🎉');
      setTimeout(() => {
        setToastMessage(''); 
        router.push(`/activeGame/${gameData.game._id}`);
      }, 5000);
      
    }

    
  }

  return (
    <>
      {session && session.user && session.user.email && (
        <>
            <ToastSuccess message={toastMessage} onClose={() => setToastMessage('')} />
            <ToastDanger message={toastError} onClose={() => setToastError(null)}/>
            <Header headline={`Hey ${session.user.firstname}💖!`} path={"Spiel Beitreten"} />
            <Styledheadline></Styledheadline>
            <StyledLabel htmlFor="newgame" />
            <StyledParagraph>Gib hier den Spiellink ein. Den Link bekommst du von deinem Spielleiter</StyledParagraph>
            <StyledForm onSubmit={handleSubmit}>
                <CredentialInput type="text" name="gameId" placeholder="Spiel-Link" />
                <TextButton type="submit" text={"Spiel beitreten"} />
            </StyledForm>
        </>
      )}
    </>
  );
}

const Styledheadline = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--brand-primary);
  text-align: center;

`;

const StyledParagraph = styled.p`
  margin: 1.5rem; 
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
  gap: 3rem; 
  width: 80%;
  margin: auto;
`;
