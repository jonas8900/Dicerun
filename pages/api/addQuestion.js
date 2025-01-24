import dbConnect from "../../db/connect";
import Question from "@/db/models/Question";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { question } = req.body;

    if (!question || typeof question !== "string") {
        return res.status(400).json({ message: "Invalid question data" });
    }

    try {
        await dbConnect(); 
        const newQuestion = await Question.create({ question });
        return res.status(201).json({ message: "Question saved", data: newQuestion });
    } catch (error) {
        console.error("Error saving question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
