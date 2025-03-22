import Head from "next/head";
import GlobalStyle from "../styles";
import { useState } from "react";
import { SWRConfig } from "swr/_internal";
import { SessionProvider } from "next-auth/react";  

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function App({ Component, pageProps }) {
    const [clicks, setClicks] = useState(0);

    return (
        <>
            <Head>
            <meta name="viewport" content="width=device-width,initial-scale=1" />
                <title>DiceRun</title>
                <meta name="description" content="DiceRun ist ein Partyspiel für alle die gern Aufgaben lösen" />
                <link rel="shortcut icon" href="/icons/icon-192x192.png" />
                <link rel="mask-icon" href="/icons/icon-192x192.png" color="#FFFFFF" />
                <meta name="theme-color" content="#ffffff" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <link
                    rel="apple-touch-icon"
                    sizes="512x512"
                    href="/icons/icon-512x512.png"
                />
                <link rel="manifest" href="/manifest.json" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://www.dicerun-game.com/" />
                <meta name="twitter:title" content="DiceRun" />
                <meta name="twitter:description" content="DiceRun ist ein Partyspiel für alle die gern Aufgaben lösen" />
                <meta name="twitter:image" content="/icons/icon-512x512.png" />
                <meta name="twitter:creator" content="@DavidWShadow" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="DiceRun" />
                <meta property="og:description" content="DiceRun ist ein Partyspiel für alle die gern Aufgaben lösen" />
                <meta property="og:site_name" content="DiceRun" />
                <meta property="og:url" content="https://www.dicerun-game.com/" />
                <meta property="og:image" content="/icons/icon-512x512.png" />
            </Head>
            <GlobalStyle />
            {/* Füge den SessionProvider hinzu */}
            <SessionProvider session={pageProps.session}>
                <SWRConfig value={{ fetcher }}>
                    <Component {...pageProps} clicks={clicks} setClicks={setClicks} />
                </SWRConfig>
            </SessionProvider>
        </>
    );
}
