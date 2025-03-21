import Button from "@/components/Buttons/Button";
import TextButton from "@/components/Buttons/TextSubmitButton";
import Icon from "@/components/Icons/iconComponent";
import CredentialInput from "@/components/Inputs/credentialInput";
import Link from "next/link";
import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import styled from "styled-components";
import { IoEyeOff } from "react-icons/io5";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CredentialSelect from "@/components/Inputs/credentialSelect";
import { IoMdArrowRoundBack } from "react-icons/io";
import ToastSuccess from "@/components/ToastMessages/Success";
import ToastDanger from "@/components/ToastMessages/Danger";

export default function Registration({className, }) {
    const router = useRouter();
    const [typeSwitch, setTypeSwitch] = useState('password');
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState('');


    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);


        const response = await fetch(`/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if(!response.ok) {
          console.log("Error");
          setToastError(response.error);
          setTimeout(() => {
            setToastMessage("");
          }, 3000);
          return;
        }

 
        
        // Warten auf DNS Aktivierung (Domain verifizierung von Vercel und Mailgun)

        // const responseMail = await fetch(`/api/sendMail`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify( data ),
        // });

        // if (responseMail.ok) {
        //   console.log("Mail sent");
        // } else {
        //   console.log("Mail not sent");
        // }

        if (response.ok) {
          setToastMessage('Erfolgreich registriert! 🎉');
          setTimeout(() => {
            setToastMessage(''); 
            router.push('/'); 
          }, 5000);
        } else {
          alert('Etwas ist schiefgelaufen, versuche es später noch einmal.');
        }


    }
  
    function handlePasswortTypeHidden() {
      setTypeSwitch('text');
  }
  
  function handlePasswortTypeVisibil() {
      setTypeSwitch('password');
  }
  


    return (
        <>
              <>
                <ToastSuccess message={toastMessage} onClose={() => setToastMessage('')} />
                <ToastDanger message={toastError} onClose={() => setToastError(null)}/>
                <StyledContainer>
                  <StyledBackIcon onClick={() => router.push("/")}/>
                  <StyledImage src="/images/Logo.png" alt="Registration" width={300} height={300} />
                </StyledContainer>
                  <StyledHeadline>Registration</StyledHeadline>
                  <StyledForm onSubmit={handleSubmit} className={className}>
                    <StyledInputContainer>
                        <StyledLabel htmlFor="salutation" />
                        <CredentialSelect
                          type="text"
                          id="salutation"
                          name="salutation"
                          placeholder="Anrede"
                          OptionArray={[{value: "Herr", text: "Herr"}, {value: "Frau", text:"Frau"}, {value: "Divers", text: "Divers"}]}
                          defaultValue={"Anrede"}
                          required
                        />
                        <StyledLabel htmlFor="firstname" />
                        <CredentialInput
                          type="text"
                          id="firstname"
                          name="firstname"
                          placeholder="Vorname"
                          required
                        />
                        <StyledLabel htmlFor="lastname" />
                        <CredentialInput
                          type="text"
                          id="lastname"
                          name="lastname"
                          placeholder="Nachname"
                          required
                        />
                      <StyledLabel htmlFor="email" />
                      <CredentialInput
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        required
                      />
                      <StyledLabel htmlFor="password" />
                      <VisibilityIcon onTouchEnd={handlePasswortTypeVisibil} onTouchStart={handlePasswortTypeHidden}>
                      <CredentialInput
                        type={typeSwitch}
                        id="password"
                        name="password"
                        placeholder="Passwort"
                        minLength="8"
                        required
                      />
                        <StyledIcon IconComponent={typeSwitch === "password" ? IoMdEye : IoEyeOff}/>
                      </VisibilityIcon>
                      <TextButton text="Registrieren" type="submit"/>
                    </StyledInputContainer>
                </StyledForm>
              </>
       </>
    )
}


const StyledImage = styled(Image)`
  display: flex;
  width: 75%; 
  height: 75%; 
  margin: auto;
  padding: 0;
  
`;

const StyledContainer = styled.div`
  position: relative; 

`;

const StyledBackIcon = styled(IoMdArrowRoundBack)`
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 2rem;
  left: 1rem;
  color: var(--brand-primary);
  cursor: pointer;
  `;

const StyledHeadline = styled.h1`
  font-size: 1.2rem;
  text-align: center;
  color:rgb(102, 102, 102);

`;

const StyledForm = styled.form`
  width: 80%;  
  margin: auto;
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  
`;

const StyledLabel = styled.label`
  display: none;
`;

const StyledOrContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2.31rem auto 2.31rem auto;
`;

const StyledDivLine = styled.div`
  width: 100%;
  height: 1px;
  background: var(--subtitle-color);
`;

const StyledParagraph = styled.p`
  font-size: 0.875rem;
  color: var(--subtitle-color);
`;



const StyledParagraphLink = styled.p`
  font-size: 0.875rem;
  color: var(--brand-primary);
  text-align: center;
  margin-top: 2.31rem;
  cursor: pointer;
`;

const VisibilityIcon = styled.div`
  position: relative;
  padding: 0;
  margin: 0 0 1rem 0;
  
`;

const StyledIcon = styled(Icon)`
  width: 1.6875rem;
  height: 1.6875rem;
  color: inherit;
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-55%);
  cursor: pointer;
  color: #CECECE;
`;

