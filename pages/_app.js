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
                <title>DiceRun</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="description" content="DiceRun ist ein Partyspiel für alle die gern Aufgaben lösen" />
                <link rel="shortcut icon" href="/icons/icon-192x192.png" />
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
