import TextButton from "@/components/Buttons/TextSubmitButton";
import Header from "@/components/Header/Header";
import CredentialInput from "@/components/Inputs/credentialInput";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function NewGame() {
  const { data: session, status } = useSession();
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
    const data = Object.fromEntries(formData);

    const response = await fetch("/api/game/addGame", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

    if (response.ok) {
        console.log("game addet");
        router.push("/yourgames");
    }

    
  }

  return (
    <>
      {session && session.user && session.user.email && (
        <>
            <Header headline={`Hey ${session.user.firstname}💖!`} path={"Neues Spiel"} />
            <Styledheadline></Styledheadline>
            <StyledLabel htmlFor="gamename" />
            <StyledParagraph>Neues Spiel erstellen</StyledParagraph>
            <StyledForm onSubmit={handleSubmit}>
                <CredentialInput type="text" name="gamename" placeholder="Name des Spieles" />
                <StyledTextButton type="submit" text={"Spiel erstellen"} />
            </StyledForm>
        </>
      )}
    </>
  );
}

const StyledTextButton = styled(TextButton)`
    background-color: var(--brand-primary);
`;

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
