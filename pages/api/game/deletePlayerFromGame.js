import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/db/connect";
import Game from "@/db/models/Game";
import User from "@/db/models/User"; 
import Task from "@/db/models/Tasks";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ message: "No access" });
  }

  const { player, game } = req.body;

  try {
    await Game.findByIdAndUpdate(game, {
      $pull: { players: player._id, admin: player._id },
    });

    await User.findByIdAndUpdate(player._id, {
      $pull: { yourgames: game },
    });

    return res.status(200).json({ message: "Player removed from game" });
  } catch (error) {
    console.error("Fehler beim Entfernen des Spielers:", error);
    return res.status(500).json({
      message: "Fehler beim Entfernen des Spielers",
      error: error.message,
    });
  }
}
