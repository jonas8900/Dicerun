import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/db/models/User";
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


  try {
    const { gameId, playerId, taskId } = req.body;


    const game = await Game.findById(gameId);
    const player = await User.findById(playerId);

    if (!game || !player) {
      return res.status(404).json({ error: 'Spiel oder Spieler nicht gefunden' });
    }

    const playerAnsweredQuestions = game.answeredQuestions.find(
      (entry) => entry.player.toString() === playerId
    );

    if (playerAnsweredQuestions) {
        const existingQuestion = playerAnsweredQuestions.questions.find(q => q.taskId.toString() === taskId.toString());
    
        if (existingQuestion) {
            existingQuestion.count += 1;
        } else {
            playerAnsweredQuestions.questions.push({
                taskId: taskId,
                count: 1  
            });
        }
    } else {
        game.answeredQuestions.push({
            player: playerId,
            questions: [{
                taskId: taskId,
                count: 1
            }]
        });
    }
    
    const updateGame = await game.save();

    if(updateGame) {
      return res.status(200).json({ message: 'Antwort erfolgreich gespeichert!' });
    } else {
      return res.status(500).json({ message: 'Fehler beim Speichern des Spiels' });
    }
  } catch (error) {
    console.error("Fehler beim Erstellen des Spiels:", error);
    return res.status(500).json({ message: "Fehler beim Erstellen des Spiels", error: error.message });
  }
}