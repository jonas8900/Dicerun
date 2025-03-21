import styled from "styled-components";

export default function TextButton({text, onClick, className, type}) {
    return (
        <StyledButton onClick={onClick} className={className} type={type}>{text}</StyledButton>
    );
}

const StyledButton = styled.button`
    display: flex;
    height: 3rem;
    padding: 0.9375rem 0.75rem;
    margin-bottom: 0;
    margin-top: 0.5rem;
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
