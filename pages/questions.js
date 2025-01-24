import { slogans } from "@/data";
import Link from "next/link";
import styled from "styled-components";
import { MdDeleteForever } from "react-icons/md";
import useSWR from "swr";

export default function Questions() {
    const { data, isLoading } = useSWR("/api/getQuestion");

    // Diese Funktion wird aufgerufen, wenn der Löschen-Button geklickt wird
    async function deleteQuestion(id) {
        console.log("ID, die gelöscht werden soll:", id); // Überprüfe, ob die ID korrekt ist

        try {
            const response = await fetch('/api/deleteQuestion', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const deleteData = await response.json();

            if (response.ok) {
                console.log('Frage gelöscht:', deleteData);
                alert('Frage gelöscht');
            } else {
                console.error('Fehler beim Löschen:', deleteData.message);
            }
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
        }
    }

    return (
        <StyledWrapper>
            <h1>Questions</h1>
            <Link href="/">zurück</Link>
            <Link href="/addquestions">neue Frage</Link>
            <div>
                <h2>Fragen</h2>
                <StyledList>
                    {data && data.map((slogan) => (
                        <StyledItemWrapper key={slogan._id}>
                            <StyledListItem>{slogan.question}</StyledListItem>
                            {/* Löschen Button, der die ID weitergibt */}
                            <StyledButton>
                                <StyledIcon onClick={() => deleteQuestion(slogan._id)} />
                            </StyledButton>
                        </StyledItemWrapper>
                    ))}
                </StyledList>
            </div>
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1rem;
`;

const StyledListItem = styled.li`
    margin: 1rem; 
    border: 1px solid #cccccc;
`;

const StyledItemWrapper = styled.div`
    display: flex;
`;

const StyledList = styled.ul`
    list-style-type: none;
    display: flex; 
    flex-direction: column;
    padding: 0;
    margin: 0;
`;

const StyledButton = styled.button`
    border: none; 
    background-color: transparent;
    cursor: pointer;
`;

const StyledIcon = styled(MdDeleteForever)`
    color: red;
    font-size: 1.5rem;
`;
