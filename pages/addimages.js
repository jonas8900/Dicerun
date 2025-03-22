import TextButton from "@/components/Buttons/TextSubmitButton";
import Header from "@/components/Header/Header";
import CredentialInput from "@/components/Inputs/credentialInput";
import ToastDanger from "@/components/ToastMessages/Danger";
import ToastSuccess from "@/components/ToastMessages/Success";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useSWR, { mutate } from "swr";
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import imageCompression from 'browser-image-compression'; 

export default function AddImages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { x } = router.query;
  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [changedFile, setChangedFile] = useState(false);
  const { data: gameData, error, isLoading } = useSWR(x ? `/api/game/getGameById?id=${x}` : null);

  if (status === "loading") {
    return <h1>Lade...</h1>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
  }



  async function handleImageUploadConverter(file) {
    const options = {
        maxSizeMB: 0.3,  
        quality: 0.8,    
        maxWidthOrHeight: 900, 
        useWebWorker: true,  
        fileType: "image/webp",  
        preserveExif: true, 
    };

    try {
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type });

        return compressedFile; 
    } catch (error) {
        console.error("Fehler bei der Komprimierung:", error);
        return file; 
    }
  }


  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("Datei ist zu groß. Maximale Größe ist 10MB.");
        return;
      }

      handleImageUploadConverter(selectedFile).then(compressedFile => {
        setFile(compressedFile);  
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    formData.append("gameId", x);
  
    if (file) {
      if (file instanceof Blob) {
          const fileWithCorrectType = new File([file], file.name, { type: file.type });
          formData.set("image", fileWithCorrectType); 
      } else {
          formData.set("image", file); 
      }
    }

    const response = await fetch("/api/game/addImage", {
        method: "POST",
        body: formData,
    });

    if(response.ok) {
        mutate(x ? `/api/game/getGameById?id=${x}` : null); 
        setToastMessage('Das Bild wurde erfolgreich hochgeladen! 🎉');
        setTimeout(() => {
          setToastMessage(''); 
        }, 3000);
    } else {
      console.error('Fehler beim Hochladen des Bildes');
      setToastError(response.error);
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }

    event.target.reset(); 
  }

    async function handleDelete(fileId) {
        const response = await fetch("/api/game/deleteImage", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: x, fileId }),
        });
    
        if (response.ok) {
        console.log("Bild gelöscht");
        mutate(x ? `/api/game/getGameById?id=${x}` : null); 
        setToastMessage('Bild erfolgreich gelöscht! ❌');
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
            <StyledLabel htmlFor="points" />
            <StyledLabel htmlFor="pointsAfterFinish" />
            <StyledIcon onClick={() => router.push(`/activeGame/${x}`)}/>
            <StyledParagraph>Neues Bild für das Spiel hochladen</StyledParagraph>
            <StyledForm onSubmit={handleSubmit}>
                <StyledLabel htmlFor="image">Bild hochladen:</StyledLabel>
                <StyledInput 
                  type="file" 
                  id="image" 
                  name="image" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  ref={fileInputRef} 
                />
                {file && (
                  <PreviewContainer>
                    <StyledImage 
                      src={URL.createObjectURL(file)} 
                      alt="Vorschau" 
                      width={200} 
                      height={200}
                    />
                  </PreviewContainer>
                )}
                <StyledTextButton text="Bild hochladen" type="submit">Hochladen</StyledTextButton>
            </StyledForm>
            <br></br>
            <hr></hr>
            <StyledParagraph>Alle Bilder:</StyledParagraph>
            <StyledTable>
              <thead>
                <tr>
                  <th>Bild</th>
                  <th>Optionen</th>
                </tr>
              </thead>
              <tbody>
                {gameData && gameData.game && gameData.game.files && gameData.game.files.length > 0 ? (
                  gameData.game.files.map((file, index) => (
                    <tr key={index}>
                      <StyledTd>
                        <StyledImage 
                          src={file} 
                          alt="Bild" 
                          width={100} 
                          height={100}
                        />
                      </StyledTd>
                      <td>
                        <StyledButton onClick={() => handleDelete(file)}>Löschen</StyledButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">Keine Bilder vorhanden</td>
                  </tr>
                )}
              </tbody>
            </StyledTable>
        </>
    )}
    </>
  );
}

const StyledImage = styled(Image)`
    width: 100%;
    height: 100%;
    object-fit: contain;
    `;

const StyledTd = styled.td`
    max-width: 80px;
    max-height: 80px;

`;

const StyledTextButton = styled(TextButton)`
    background-color: var(--brand-primary);
`;

const PreviewContainer = styled.div`
    width: 200px;
    height: 200px;
    margin: 1rem auto;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledInput = styled(CredentialInput)`
  width: 70%;
  margin-bottom: 0;
`;

const StyledIcon = styled(IoMdArrowRoundBack)`
  width: 2rem;
  height: 2rem;
  margin-left: 2rem;
  cursor: pointer;
`;

const StyledAlertParagraph = styled.p`
  font-size: 0.8rem;
  padding: 0;
  margin: 0;
  color:black;
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