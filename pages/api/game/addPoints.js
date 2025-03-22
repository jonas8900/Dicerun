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
    const { gameId, playerId, points, fail, taskId, pointsAfterFinish } = req.body;

    
    const game = await Game.findById(gameId);
    const player = await User.findById(playerId);

    if (!game || !player) {
      return res.status(404).json({ error: 'Spiel oder Spieler nicht gefunden' });
    }

    const playerScore = game.scores.find(score => score.player.toString() === playerId);

      const playerAnsweredQuestions = game.answeredQuestions.find(
      (entry) => entry.player.toString() === playerId
    );

    if (playerScore) {
      if (fail) {
        playerScore.points = playerScore.points; 
      } else {
        const answeredQuestion = playerAnsweredQuestions.questions.find(
          (answeredQuestion) => answeredQuestion.taskId.toString() === taskId.toString()
        );
        
        if (answeredQuestion) {
          playerScore.points += pointsAfterFinish;
        } else {
          playerScore.points += points;
        }
      }
    } else {
      game.scores.push({ player: playerId, points: fail ? 0 : points });
    }
    
    const updatedGame = await game.save();


    if (updatedGame) {
      res.status(200).json({ message: 'Punkte erfolgreich hinzugefügt!' });
    } else {
      res.status(500).json({ message: 'Fehler beim Speichern des Spiels' });
    }

  } catch (error) {
    console.error("Fehler beim Erstellen des Spiels:", error);
    return res.status(500).json({ message: "Fehler beim Erstellen des Spiels", error: error.message });
  }
}