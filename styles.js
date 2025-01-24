import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

@font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter/inter_18pt-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter/inter_18pt-SemiBold.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter/inter_18pt-Bold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
  }


  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto/Roboto-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto/Roboto-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto/Roboto-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto/Roboto-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
  }



  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {

    font-family: 'Roboto', sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;

  }

  :root {
    --brand-primary: #000000;
    --brand-secondary: #1400ff;
    --brand-secondary-accent: #005C9F;
    --accent-color:rgba(0, 93, 159, 0.1);
    --subtitle-color: #BCBCBC;
    --subtitle-light-color: #DFDFDF;
    --font-size-body: 14px;
    --font-size-small: 12px;
  }


    h1 {
        font-size: 16px;
        font-weight: 600;
        color: var(--brand-primary);
    }


    h2 {
        font-size: 14px;
        font-weight: 500;
        color: var(--brand-primary);
    }

    ::placeholder {
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        color: var(--subtitle-color)
    }
`;
