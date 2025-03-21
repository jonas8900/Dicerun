import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/db/connect";
import Game from "@/db/models/Game";
import User from "@/db/models/User";

export default async function handler(request, response) {
    await dbConnect();

    const session = await getServerSession(request, response, authOptions);

    if (!session) {
        return response.status(403).json({ message: "No access" });
    }

    if (request.method === "POST") {
        try {
            const { inviteLink, game } = request.body;

            if (!inviteLink || !game) {
                return response.status(400).json({ message: "Missing required fields: inviteLink or game" });
            }

           
            const updatedGame = await Game.findByIdAndUpdate(
                game, 
                { invitelink: inviteLink }, 
                { new: true } 
            );

            if (!updatedGame) {
                return response.status(404).json({ message: "Game not found" });
            }

            return response.status(200).json({
                message: "Invite link updated successfully",
                game: updatedGame, 
            });

        } catch (error) {
            console.error("Error updating invite link:", error);
            return response.status(500).json({ message: "An error occurred while updating the invite link." });
        }
    } else {

        return response.status(405).json({ message: "Method Not Allowed" });
    }
}
