import Question from "@/db/models/Question";
import dbConnect from "../../db/connect";

export default async function handler(request, response) {
    await dbConnect();

    if (request.method === "GET") {
        try {
            const question = await Question.find();
            response.status(200).json(question);
        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    } else {
        response.status(405).json({ error: "Methode nicht erlaubt" });
    }
}
