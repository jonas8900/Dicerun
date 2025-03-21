import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/db/connect";
import Game from "@/db/models/Game";

export default async function handler(request, response) {
    await dbConnect();

    const session = await getServerSession(request, response, authOptions); 

    if (!session) {
        return response.status(403).json({ message: "No access" });
    }

    if (request.method === "GET") {
        try {
            const { x: gameId } = request.query; 

            if (!gameId) {
                return response.status(400).json({ message: "Missing game ID" });
            }

            const game = await Game.findById(gameId).select("questions").populate("questions");

            if (!game) {
                return response.status(404).json({ message: "Game not found" });
            }

            return response.status(200).json(game);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Internal Server Error" });
        }
    }
}
