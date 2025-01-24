import dbConnect from "@/db/connect";
import Question from "@/db/models/Question";

export default async function handler(request, response) {
    await dbConnect();


    const { id } = request.body;

    if(request.method === "DELETE") {
        try {
            const question = await Question.findByIdAndDelete(id);
           
            response.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    }
}