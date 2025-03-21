
import TextButton from "@/components/Buttons/TextSubmitButton";
import Icon from "@/components/Icons/iconComponent";
import CredentialInput from "@/components/Inputs/credentialInput";
import Link from "next/link";
import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import styled from "styled-components";
import { IoEyeOff } from "react-icons/io5";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import ToastSuccess from "@/components/ToastMessages/Success";
import ToastDanger from "@/components/ToastMessages/Danger";

export default function Login({ clicks, setClicks, className }) {
    const router = useRouter();
    const [typeSwitch, setTypeSwitch] = useState('password');
    const [toastMessage, setToastMessage] = useState('');
    const [error, setError] = useState(null);


    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

        setError(null);
    
        const response = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
    
        if (response.error) {
          setError(response.error);
          setToastMessage('Email oder Passwort stimmen nicht überein');
          setTimeout(() => {
            setToastMessage(''); 
            router.push('/auth/login');
          }, 4000);
        } else {
          setToastMessage('Erfolgreich eingeloggt! 🎉')
          setTimeout(() => {
            setToastMessage(''); 
            router.push('/'); 
          }, 4000);
        }

    }
  
    function handlePasswortTypeHidden() {
      setTypeSwitch('text');
  }
  
  function handlePasswortTypeVisibil() {
      setTypeSwitch('password');
  }
  


    return(
        <>
              <>
              <ToastSuccess message={toastMessage} onClose={() => setToastMessage('')} />
              <ToastDanger message={error} onClose={() => setToastMessage(null)} />
                <StyledImage src={"/images/Logo.png"} width={200} height={200} alt="Logo" />
                  <StyledForm onSubmit={handleSubmit} className={className}>
                    <StyledInputContainer>
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
                        required
                      />
                        <StyledIcon IconComponent={typeSwitch === "password" ? IoMdEye : IoEyeOff}/>
                      </VisibilityIcon>
                      <TextButton text="Login" type="submit"/>
                    </StyledInputContainer>
                    <StyledOrContainer>
                      <StyledDivLine></StyledDivLine>
                      <StyledParagraph>oder</StyledParagraph>
                      <StyledDivLine></StyledDivLine>
                    </StyledOrContainer>
                    {/* <StyledLoginMethodsContainer>
                      <LoginWithButton IconComponent={FcGoogle} />
                      <LoginWithButton IconComponent={FaApple} />
                    </StyledLoginMethodsContainer> */}
                    <StyledParagraphLink>
                      noch keinen Account?{" "}
                      <Link href="/registration">Registriere dich jetzt</Link>
                    </StyledParagraphLink>
                </StyledForm>
              </>
       </>
    )
}


const StyledImage = styled(Image)`
  width: 100%; 
  height: 100%; 
  
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
  margin: 0;
  
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

