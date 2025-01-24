import Button from "@/components/Button";

export default function Home({ clicks, setClicks }) {
    return(
        <>
            <Button clicks={clicks} setClicks={setClicks}>Domes Grüße anzeigen</Button>
        </>
    )
}

