import { useRouter } from "next/router";

export default function AddQuestions() {
    const router = useRouter();

    function handleSubmit(event) {
        event.preventDefault();
        const question = event.target.question.value;

        fetch("/api/addQuestion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question }),
        })
    }


    return(
        <div>
            <h1>AddQuestions</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="question">Sätze eintragen</label>
                <textarea id="question" name="question" placeholder="Frage" maxlength="500" rows="4" cols="50" required></textarea>
                <button type="submit">Satz speichern</button>
            </form>
            
        </div>
    )

}