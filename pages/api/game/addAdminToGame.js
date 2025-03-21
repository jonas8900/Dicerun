import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/db/connect";
import Game from "@/db/models/Game";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const session = await getServerSession(req, res, authOptions); 
  
  if (!session) {
    return res.status(403).json({ message: "No access" });
  }

    const { player } = req.body;
    const { game } = req.body;

    console.log(req.body);
    console.log(player._id);

  try {
   
    await Game.findByIdAndUpdate(
        game,
      { $push: { admin: player._id } },  
      { new: true }  
    );

    return res.status(201).json({ message: "Game updated" });
  } catch (error) {
    console.error("Fehler beim Erstellen des Spiels:", error);
    return res.status(500).json({ message: "Fehler beim Erstellen des Spiels", error: error.message });
  }
}