import TextButton from "@/components/Buttons/TextSubmitButton";
import Header from "@/components/Header/Header";
import CredentialSelect from "@/components/Inputs/credentialSelect";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";

export default function YourGames() {
  const { data: session, status } = useSession();
  const { data: games, isLoading } = useSWR("/api/game/getGames");
  let gameOptions = [];
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

    router.push(`/activeGame/${data.game}`);

    
  }


  if(games && !games.message) {
     gameOptions = games.map((game) => ({
      value: game._id, 
      text: game.name
    }));
  }
  


  return (
    <>
      {session && session.user && session.user.email && (
        <>
            <Header headline={`Hey ${session.user.firstname}💖!`} path={"Deine Spiele"}/>
            <Styledheadline></Styledheadline>
            <StyledLabel htmlFor="newgame" />
            <StyledParagraph>Deine Spiele:</StyledParagraph>
            <StyledFormGameSubmit onSubmit={handleSubmit}>
              <CredentialSelect
                type="text"
                id="game"
                name="game"
                placeholder="Anrede"
                OptionArray={
                  gameOptions
                }
                defaultValue={"Spiel auswählen"}
                required
              />
              <TextButton text={"Spiel auswählen"}></TextButton>
            </StyledFormGameSubmit>

        </>
    
      )}
    </>
  );
}

const StyledFormGameSubmit = styled.form`
  width: 80%;
  margin: auto;
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
