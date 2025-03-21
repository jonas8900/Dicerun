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
            const { gameId } = request.body;

            const userId = session.user.id;

            if (!gameId) {
                return response.status(400).json({ message: "Missing required fields: gameId" });
            }

            let urlParams = new URLSearchParams(new URL(gameId).search);
            let id = urlParams.get("x");

           
            const updatedGame = await Game.findByIdAndUpdate(
                id, 
                { $push: { players: userId } },  
                { new: true }
            );

            const updateUser = await User.findByIdAndUpdate(
                userId, 
                { $push: { yourgames: id } }, 
                { new: true }
            );

            if (!updatedGame || !updateUser) {
                return response.status(404).json({ message: "Game not found" });
            }

            return response.status(200).json({
                message: "Invite link updated successfully",
                game: updatedGame, 
                user: updateUser
            });

        } catch (error) {
            console.error("Error updating invite link:", error);
            return response.status(500).json({ message: "An error occurred while updating the invite link." });
        }
    } else {
        return response.status(405).json({ message: "Method Not Allowed" });
    }
}
