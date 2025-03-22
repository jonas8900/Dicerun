import styled from "styled-components";

export default function CredentialInput({type, placeholder, min, max, id, name, className, required, labeltext, onChange, maxLength, value, minLength, step, onInput, pattern, inputMode}) {
    return (
        <InputContainer className={className}>
            <StyledLabel htmlFor={id} className={className}>{labeltext}</StyledLabel>
            <StyledInput type={type} min={min} max={max} placeholder={placeholder} value={value} id={id} name={name} className={className} onChange={onChange} maxLength={maxLength} required={required} minLength={minLength} step={step} onInput={onInput} pattern={pattern} inputMode={inputMode} />
        </InputContainer>
    );
}

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.75rem;
`;


const StyledLabel = styled.label`
    font-size: 14px;
    color: var(--brand-primary);
    text-align: left;
    font-weight: 500;
    margin-bottom: 0.5rem;
`;

const StyledInput = styled.input`
    max-width: 30rem;
    height: 3rem;
    padding: 1rem 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid  #BCBCBC;
    background: #FFF;
`;