import TextButton from "@/components/Buttons/TextSubmitButton";
import Header from "@/components/Header/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function Home({ clicks, setClicks, className }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return <h1>Lade...</h1>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
  }


  return (
    <>
      {session && session.user && session.user.email && (
        <>
            <Header headline={`Hey ${session.user.firstname}💖!`} path={"Home"}/>
            <Styledheadline></Styledheadline>
            <StyledLabel htmlFor="newgame" />
            <StyledParagraph>Wilkommen bei DiceRun, beginne ein neues Spiel mit deinen Freunden oder mache dein altes Spiel weiter</StyledParagraph>
            <StyledContainer>
              <StyledNewGameButton type="button" onClick={() => router.push("/newgame")} text={"Neues Spiel erstellen"} />
              <StyledJoinGameButton type="button" onClick={() => router.push("/joingame")} text={"Spiel beitreten"} />
              <StyledTextButton type="button" onClick={() => router.push("/yourgames")} text={"Deine Spiele"} />
            </StyledContainer>
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

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem; 
  margin: 5rem auto 2rem auto;
`;

const StyledTextButton = styled(TextButton)`
    margin: auto;
    background-color:rgb(3, 3, 3);
    min-width: 12rem;
`;

const StyledNewGameButton = styled(TextButton)`
    margin: auto;
    min-width: 12rem;
`;

const StyledJoinGameButton = styled(TextButton)`
    margin: auto;
    min-width: 12rem;
    color: black;
    background-color:rgb(0, 238, 255);
`;